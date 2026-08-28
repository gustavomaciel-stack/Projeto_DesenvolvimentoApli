import { AppError } from '../errors/AppError.js';
import { matchRepository } from '../repositories/matchRepository.js';
import { participationRepository } from '../repositories/participationRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export const participationService = {
  join: async (matchId: string, userId: string) => {
    const match = await matchRepository.findById(matchId);
    if (!match) throw new AppError('Partida não encontrada.', 404);
    if (match.status !== 'ABERTA') {
      throw new AppError('A partida não está aberta para participação.', 400);
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('Usuário não encontrado.', 404);

    const existing = await participationRepository.findByMatchAndUser(matchId, userId);
    if (existing?.status === 'CONFIRMADA') {
      throw new AppError('Usuário já participa desta partida.', 409);
    }

    const confirmed = await matchRepository.countConfirmedParticipants(matchId);
    if (confirmed >= match.vacancies) {
      throw new AppError('Não há vagas disponíveis nesta partida.', 409);
    }

    const participation = existing
      ? await participationRepository.reactivate(existing.id)
      : await participationRepository.create(matchId, userId);
    const newCount = confirmed + 1;

    if (newCount >= match.vacancies) {
      await matchRepository.updateStatus(matchId, 'COMPLETA');
    }

    return participation;
  },

  leave: async (matchId: string, userId: string) => {
    const match = await matchRepository.findById(matchId);
    if (!match) throw new AppError('Partida não encontrada.', 404);

    const participation = await participationRepository.findByMatchAndUser(matchId, userId);
    if (!participation || participation.status !== 'CONFIRMADA') {
      throw new AppError('Participação confirmada não encontrada.', 404);
    }

    const result = await participationRepository.cancel(participation.id);
    if (match.status === 'COMPLETA') {
      await matchRepository.updateStatus(matchId, 'ABERTA');
    }

    return result;
  },

  listByMatch: async (matchId: string) => {
    const match = await matchRepository.findById(matchId);
    if (!match) throw new AppError('Partida não encontrada.', 404);

    const participants = await participationRepository.findConfirmedByMatch(matchId);
    return participants.map((participation) => ({
      name: participation.user.name,
      email: participation.user.email,
      createdAt: participation.createdAt,
    }));
  },
};
