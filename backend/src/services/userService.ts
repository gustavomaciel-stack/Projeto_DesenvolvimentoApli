import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';

const SALT_ROUNDS = 10;

export const userService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new AppError('Nome, e-mail e senha são obrigatórios.', 400);
    }

    if (password.length < 6) {
      throw new AppError('A senha deve ter pelo menos 6 caracteres.', 400);
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Já existe um usuário com este e-mail.', 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({ name, email, passwordHash });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  list: async () => {
    const users = await userRepository.findAll();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    }));
  },

  getById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
