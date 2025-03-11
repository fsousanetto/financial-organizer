import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Preencha todos os campos' });
        } 
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
    
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'Email inválido' });
        } else if (!passwordRegex.test(req.body.password)) {
            return res.status(400).json({ message: `A senha deve conter: \n1 letra maiúscula,\n1 caractere especial\nTer no mínimo 6 caracteres` });
        }
        
        const { name, email, password } = req.body;

        const existUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        console.log('Usuário cadastrado: ', user);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.log('Erro: ', error);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
    
};

const updateUser = async (req, res) => {
   try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Informe o ID do usuário' });
        }

        const data = {};

        if (name) {
            data.name = name;
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'E-mail inválido' });
            }

            const existUser = await prisma.user.findUnique({
                where: { email }
            })

            if (existUser) {
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }

            data.email = email;
        }

        if (password) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: `A senha deve conter: \n1 letra maiúscula,\n1 caractere especial\nTer no mínimo 6 caracteres` });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            data.password = hashedPassword;
        }

        if (!Object.keys(data).length) {
            return res.status(400).json({ message: 'Informe os dados que deseja atualizar' });
        }

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                password: data.password ?? undefined
            }
        });

        res.json(updateUser);

   } catch (error) {
         console.log('Erro ao atualizar usuário: ', error);
         res.status(500).json({ message: 'Erro ao atualizar usuário' });
   }
}

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('Body login: ', req.body);
//         const user = await prisma.user.findUnique({ where: { email } });

//         if ( !user ) {
//             return res.status(401).json({ error: 'Usuário ou senha inválidos' });
//         }

//         const isPassword = await bcrypt.compare( password, user.password )
//         if ( !isPassword ) {
//             return res.status(401).json({ error: 'Usuário ou senha inválidos' });
//         }

//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

//         console.log('Usuário log', user, 'Token', token)
//         res.json({ token });

//     } catch (error) {
//         console.log('Erro: ', error);
//         res.status(500).json({ error: 'Erro ao realizar login' });
//     }
// };

const getUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.json(users)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
}

export default { register, updateUser, getUser };