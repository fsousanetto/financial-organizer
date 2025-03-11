import pkg from "jsonwebtoken";
const { verify } = pkg;

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if( !authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado! Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, JWT_SECRET);
        console.log('Token decodificado: ', decoded);
        
        req.userId = decoded.userId;
        if (!req.userId) {
            return res.status(401).json({ error: 'Token inválido ID do usuário não encontrado' });
        }
        next();

    } catch (error) {
        console.error('Token inválido', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
}

export default authMiddleware;