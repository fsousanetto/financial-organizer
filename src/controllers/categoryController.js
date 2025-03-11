import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
    try {
        const { category } = req.body;

        const existingCategory = await prisma.category.findUnique({
            where: { category }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Categoria já cadastrada' });
        }

        const newCategory = await prisma.category.create({
            data: { category }
        });

        res.status(201).json(newCategory);

    } catch (error) {
        console.log('Erro: ', error);
        res.status(500).json({ message: 'Erro ao cadastrar categoria' });
    }
};

export const getCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json(categories);

    } catch (error) {
        console.log('Erro ao buscar categoria: ', error);
        res.status(500).json({ message: 'Erro ao buscar categoria' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await prisma.category.update({
            where: { id: String(id) },
            data: { category: name }
        });

        res.status(200).json(category);

    } catch (error) {
        console.log('Erro ao atualizar categoria: ', error);
        res.status(500).json({ message: 'Erro ao atualizar categoria' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Id recebido: ', id);

        if (!req.userId) {
            return res.status(401).json({ message: 'Usuário não autorizado' });
        }

        const category = await prisma.category.findUnique({ where: { id: String(id) } });
        console.log('Categoria encontrada: ', category);

        if (!category) {
            console.log('Id recebido: ', req.params);
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }

        if (category.id !== req.params.id) {
            console.log('Id esperado: ', category?.id, 'Id recebido: ', req.params.id);
            return res.status(401).json({ message: 'Acesso não autorizado' });
        }

        await prisma.category.delete({ where: { id: String(id) } });

        res.status(200).json({ message: 'Categoria deletada com sucesso' });

    } catch (error) {
        console.log('Erro ao deletar categoria: ', error);
        res.status(500).json({ message: 'Erro ao deletar categoria' });
    }
};
