## 📊 Organizador Financeiro 📈  
> Um sistema simples e eficiente para gerenciar suas finanças pessoais! 💰💡  

### 💻 Tecnologias Utilizadas  
- **Backend:** Node.js + Express  
- **Banco de Dados:** PostgreSQL + Prisma ORM  
- **Autenticação:** JWT (Access Token & Refresh Token)  
- **Segurança:** Helmet, CORS  
- **Infraestrutura:** Docker (opcional)  

---

## 🚀 Como Configurar o Projeto  

### 1️⃣ Clone o Repositório  
```bash
git clone https://github.com/seuusuario/organizador-financeiro.git
cd organizador-financeiro/backend
```

### 2️⃣ Configure as Variáveis de Ambiente  
Crie um arquivo **.env** e defina as configurações:  

```ini
DATABASE_URL="postgresql://user:password@localhost:sua_porta_aqui/organizador"
JWT_SECRET="sua_chave_secreta"
PORT=<sua_porta_aqui>
```

### 3️⃣ Instale as Dependências  
```bash
npm install
```

### 4️⃣ Execute as Migrações do Banco de Dados  
```bash
npx prisma migrate dev
```

### 5️⃣ Inicie o Servidor  
```bash
npm run dev
```

Servidor rodando em: **http://localhost:7654** 🚀  

---

## 🔑 Autenticação (JWT + Refresh Token)  
### ✅ **Login**  
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```
**Resposta:**
```json
{
  "accessToken": "xxx.yyy.zzz",
  "refreshToken": "aaa.bbb.ccc"
}
```

### 🔄 **Refresh Token**  
```http
POST /api/auth/refresh
```
**Body:**
```json
{
  "refreshToken": "aaa.bbb.ccc"
}
```

### 🚪 **Logout**  
```http
POST /api/auth/logout
```

---

## 🗺️ Rotas Principais  

### 🙍‍♂️ **Usuários**  
✅ **Registrar Usuário**  
```http
POST /api/users/register
```

✅ **Atualizar Usuário**  
```http
PUT /api/users/update/:id
```

### 💸 **Transações**  
✅ **Criar Transação**  
```http
POST /api/transactions
```

✅ **Listar Transações**  
```http
GET /api/transactions
```

### 🏷️ **Categorias**  
✅ **Criar Categoria**  
```http
POST /api/categories
```

✅ **Listar Categorias**  
```http
GET /api/categories
```

---

## 🛠️ Prisma e Banco de Dados  

### 📌 Rodando as Migrações  
```bash
npx prisma migrate dev
```

### 📌 Acessando o Banco com Prisma Studio  
```bash
npx prisma studio
```

---

## 🛡️ Segurança & Boas Práticas  
✅ **Helmet** para proteção contra ataques comuns 🚨  
✅ **CORS** para definir acessos externos 🌍  
✅ **Tokens JWT com Refresh Token** 🔑  
✅ **Senhas criptografadas com bcrypt** 🔒  

---

## 📌 Melhorias Futuras  
- [ ] 📲 Criar versão mobile do app  
- [ ] 📊 Relatórios financeiros dinâmicos  
- [ ] 💳 Integração com APIs bancárias (Itaú, Banco do Brasil)  

---

### 💡 Contribuições São Bem-Vindas!  
Sinta-se à vontade para abrir **issues** ou enviar um **pull request**! 🚀  

📌 **Criado por:** [Francisco Moreira](https://www.linkedin.com/in/francisco-sousa1/) ✨  

---
