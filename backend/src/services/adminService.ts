import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/userRepository.js';

export const adminService = {
  ensureDefaultAdmin: async () => {
    const existingAdmin = await userRepository.findByEmail(env.adminEmail);

    if (existingAdmin) {
      if (existingAdmin.role !== 'ADMIN') {
        await userRepository.updateRole(existingAdmin.id, 'ADMIN');
      }
      return existingAdmin;
    }

    const passwordHash = await bcrypt.hash(env.adminPassword, 10);

    return userRepository.create({
      name: 'Administrador',
      email: env.adminEmail,
      passwordHash,
      role: 'ADMIN',
    });
  },
};
