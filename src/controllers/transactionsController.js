import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (req, res) => {
    try {
        const { type, category, amount, user } = req.body;

        console.log('Dados da transação: ', req.body);

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Tipo de transação inválido' });
        };

        if (!category || !amount) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        };

        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { category: category }
        });

        if (!existingCategory) {
            console.log('Categoria não encontrada: ', existingCategory);
            return res.status(400).json({ error: 'Categoria não encontrada' });
        }

        const transaction = await prisma.transaction.create({
            data: {
                type,
                category: { connect: { category: existingCategory.category } },
                amount,
                user: { connect: { id: user } }
            }
        });

        console.log('Transação criada: ', transaction);
        res.status(201).json(transaction);

    } catch (error) {
        console.log('Erro ao criar transaçao: ', error);
        res.status(500).json({ error: 'Erro ao criar transação' });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Erro ao buscar transações: ', error);
        res.status(500).json({ error: 'Erro ao carregar transações' });
    }
};

export const updateTransactions = async (req, res) => {
    try {
        console.log("Usuário autenticado: ", req.userId)

        const { id } = req.params;
        const { type, category, amount } = req.body;
        console.log("ID recebido:", id);

        if (!req.userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const  transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        console.log('Transação encontrada: ', transaction);

        if ( !transaction || transaction.userId !== req.userId ) {
            console.log('Id eperado: ', transaction?.userId, 'Id recebido: ', req.userId);
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        if (transaction.userId !== req.userId) {
            return res.status(401).json({ error: 'Acesso negado' });
        }

        const updateTransaction = await prisma.transaction.update({
            where: { id },
            data: { type, category, amount },
        })

        res.json(updateTransaction);

    } catch (error) {
        console.error('Erro ao atualizar transações: ', error);
        res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recebido:", id);
        console.log("Usuário autenticado:", req.userId);

        if (!req.userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }

        if (transaction.userId !== req.userId) {
            return res.status(403).json({ error: "Acesso não autorizado" });
        }

        await prisma.transaction.delete({
            where: { id }
        });

        res.json({ message: "Transação deletada com sucesso" });

    } catch (error) {
        console.error("Erro ao deletar transação: ", error);
        res.status(500).json({ error: "Erro ao deletar transação" });
    }
};

