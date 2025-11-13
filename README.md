# 🩺 API AURA - Sistema de Gestão de Saúde Mental

Este projeto é uma API desenvolvida em **Node.js** com **Express** e **MongoDB**, para gerenciar informações de pacientes, profissionais de saúde, triagem, diário emocional, registro de humor e atividades terapêuticas.

---

## 📌 Requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/download/) (versão LTS recomendada)
- [MongoDB](https://www.mongodb.com/try/download/community) (local ou Atlas)
- [Git](https://git-scm.com/download/win) (opcional, mas recomendado)

---

## ⚙️ Instalação do Node.js (Windows)

1. Baixe o instalador do [Node.js LTS](https://nodejs.org/en/download/).
2. Execute o instalador (`.msi`) e marque a opção:
   - ✅ "Automatically install the necessary tools".
3. Após a instalação, verifique no terminal (PowerShell ou CMD):

```bash
   node -v
   npm -v
```

Isso deve retornar as versões do **Node.js** e do **npm**.

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Giovanna-Cavalcanti/auraTccBackend.git
cd auraTccBackend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Verifique as variáveis de ambiente

Veja se há o arquivo `.env` na raiz do projeto

### 4. Inicie o servidor

```bash
npm start
```

Ou em modo de desenvolvimento com **nodemon** (se instalado):

```bash
npm run dev
```

O servidor rodará em:

```
http://localhost:3000
```

---

## 📡 Rotas principais

### 👤 Pacientes

* `POST /api/pacientes` → Cadastrar novo paciente
* `POST /api/pacientes/login` → Login do paciente
* `GET /api/pacientes` → Listar todos os pacientes
* `GET /api/pacientes/:id` → Buscar paciente por ID
* `GET /api/pacientes/buscar/cpf?cpf=` → Buscar paciente por CPF
* `PUT /api/pacientes/:id` → Atualizar paciente
* `DELETE /api/pacientes/:id` → Deletar paciente

### 👨‍⚕️ Profissionais

* `POST /api/profissionais` → Cadastrar novo profissional
* `POST /api/profissionais/login` → Login do profissional
* `GET /api/profissionais` → Listar todos os profissionais
* `GET /api/profissionais/:id` → Buscar profissional por ID
* `PUT /api/profissionais/:id` → Atualizar profissional
* `PUT /api/profissionais/:id/completar` → Completar cadastro (descrição e localização)
* `DELETE /api/profissionais/:id` → Deletar profissional
* `GET /api/profissionais/:id/pacientes` → Listar pacientes vinculados
* `GET /api/profissionais/:id/solicitacoes` → Listar solicitações pendentes
* `PUT /api/profissionais/:profissionalId/solicitacoes/:pacienteId` → Aceitar/recusar solicitação
* `DELETE /api/profissionais/:profissionalId/desvincular/:pacienteId` → Desvincular paciente

### 📋 Triagem

* `POST /api/triagem` → Criar nova triagem
* `GET /api/triagem/:pacienteId` → Buscar triagens do paciente
* `PUT /api/triagem/:pacienteId` → Atualizar triagem

### 📝 Diário Emocional

* `POST /api/diario` → Criar nova anotação
* `GET /api/diario/paciente/:pacienteId` → Listar todas as anotações do paciente
* `GET /api/diario/:id` → Buscar anotação específica
* `PUT /api/diario/:id` → Atualizar anotação
* `DELETE /api/diario/:id` → Deletar anotação

### 😊 Registro de Humor

* `POST /api/humor` → Registrar ou atualizar humor do dia
* `GET /api/humor/:pacienteId` → Listar todos os registros de humor
* `GET /api/humor/:pacienteId/:data` → Buscar humor de data específica (formato: YYYY-MM-DD)
* `DELETE /api/humor/:id` → Deletar registro de humor

### ✅ Atividades Terapêuticas

* `POST /api/atividades` → Criar nova atividade (psicólogo)
* `GET /api/atividades/paciente/:pacienteId` → Ver atividades do paciente
* `GET /api/atividades/psicologo/:psicologoId` → Ver atividades criadas pelo psicólogo
* `GET /api/atividades/:id` → Ver atividade específica
* `PUT /api/atividades/:id/progresso` → Atualizar progresso da atividade
* `DELETE /api/atividades/:id` → Deletar atividade

## 📚 Documentação Swagger

Acesse a documentação interativa completa da API em:

```
http://localhost:3000/docs
```

A documentação Swagger permite testar todos os endpoints diretamente pelo navegador.

---

## 🔒 Autenticação

Algumas rotas requerem autenticação JWT. Após o login, inclua o token no header:

```
Authorization: Bearer {seu-token-aqui}
```

---

## 🛠️ Tecnologias utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Swagger** - Documentação da API

---
