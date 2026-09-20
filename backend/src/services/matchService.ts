import { AppError } from "../errors/AppError.js";
import { matchRepository } from "../repositories/matchRepository.js";
import { participationRepository } from "../repositories/participationRepository.js";
import { userRepository } from "../repositories/userRepository.js";

export type MatchInput = {
  sport: string;
  location: string;
  date: string;
  time: string;
  vacancies: number;
  organizerId: string;
};

const parseMatchInput = (data: MatchInput) => {
  const { sport, location, date, time, vacancies, organizerId } = data;
  const parsedVacancies = Number(vacancies);
  const parsedDate = new Date(date);

  if (!sport || !location || !date || !time || !organizerId) {
    throw new AppError(
      "Esporte, local, data, horário e organizador são obrigatórios.",
      400,
    );
  }

  if (!Number.isInteger(parsedVacancies) || parsedVacancies <= 0) {
    throw new AppError("A quantidade de vagas deve ser maior que zero.", 400);
  }

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError("A data da partida é inválida.", 400);
  }

  return {
    sport,
    location,
    date: parsedDate,
    time,
    vacancies: parsedVacancies,
    organizerId,
  };
};

export const matchService = {
  create: async (data: MatchInput) => {
    const input = parseMatchInput(data);
    const organizer = await userRepository.findById(input.organizerId);

    if (!organizer) {
      throw new AppError("Organizador não encontrado.", 404);
    }

    return matchRepository.create(input);
  },

  list: async () => {
    const matches = await matchRepository.findAll();
    return matches.map((match) => ({
      id: match.id,
      sport: match.sport,
      location: match.location,
      date: match.date,
      time: match.time,
      vacancies: match.vacancies,
      status: match.status,
      organizer: match.organizer,
      confirmedParticipants: match._count.participations,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    }));
  },

  getById: async (id: string) => {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError("Partida não encontrada.", 404);
    }

    const participants = await participationRepository.findConfirmedByMatch(id);

    return {
      ...match,
      participants: participants.map((participation) => participation.user),
    };
  },

  update: async (id: string, data: MatchInput) => {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError("Partida não encontrada.", 404);
    }
    if (match.organizerId !== data.organizerId) {
      throw new AppError("Acesso negado.", 403);
    }
    if (match.status === "CANCELADA" || match.status === "CONCLUIDA") {
      throw new AppError("Esta partida não pode mais ser editada.", 400);
    }

    const input = parseMatchInput(data);
    const confirmed = await matchRepository.countConfirmedParticipants(id);
    if (input.vacancies < confirmed) {
      throw new AppError(
        "As vagas não podem ser menores que os participantes confirmados.",
        400,
      );
    }

    return matchRepository.update(id, {
      sport: input.sport,
      location: input.location,
      date: input.date,
      time: input.time,
      vacancies: input.vacancies,
    });
  },

  cancel: async (id: string, organizerId: string) => {
    const match = await matchRepository.findById(id);
    if (!match) {
      throw new AppError("Partida não encontrada.", 404);
    }
    if (match.organizerId !== organizerId) {
      throw new AppError("Acesso negado.", 403);
    }
    if (match.status === "CANCELADA") {
      throw new AppError("A partida já está cancelada.", 400);
    }

    return matchRepository.cancel(id);
  },
};
