import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";

type LoginInput = {
  email?: string;
  password?: string;
};

export const authService = {
  login: async (data: LoginInput = {}) => {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const user = await userRepository.findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError("Configuração de autenticação indisponível.", 500);
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    return { token };
  },
};
