import { PrismaClient } from "@prisma/client";
import pkg from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { sign } = pkg;
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Remover token de atualização existente, se houver
        await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        return res.status(200).json({ accessToken, refreshToken });

    } catch (error) {
        console.log('Erro ao realizar login: ', error)
        res.status(500).json({ message: 'Erro ao realizar login' });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        console.log('Refresh token recebido: ', refreshToken);
        return res.status(400).json({ message: 'Refresh token não fornecido' });
    };

    try {
        const decoded = pkg.verify(refreshToken, JWT_REFRESH_SECRET);
        const userId = decoded.userId;

        const tokenExists = await prisma.refreshToken.findUnique({
            where: { userId }
        });

        if (!tokenExists) {
            return res.status(400).json({ message: 'Refresh token inválido' });
        };

        if (tokenExists.token !== refreshToken) {
            return res.status(400).json({ message: 'Refresh token inválido' });
        }

        if (tokenExists) {
            await prisma.refreshToken.update({
                where: { userId },
                data: { token: refreshToken }
            })
        }

        const newAccessToken = sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });

        return res.status(200).json({ accessToken: newAccessToken })

    } catch (error) {
        console.log('Erro ao renovar token: ', error);
        return res.status(500).json({ message: 'Refresh token inválido ou expirado' });
    };
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Token não fornecido' });
        }

        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

        return res.status(200).json({ message: 'Logout realizado com sucesso' });

    } catch (error) {
        console.log('Erro ao realizar logout: ', error);
        return res.status(500).json({ message: 'Erro ao realizar logout' });
    }
};