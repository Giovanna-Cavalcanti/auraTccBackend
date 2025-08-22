Claro! Aqui está um exemplo de `README.md` bem focado em **configuração e execução do projeto** no Windows:

```markdown
# 🩺 API AURA - inicial - CRUD de pacientes

Este projeto é uma API desenvolvida em **Node.js** com **Express** e **MongoDB**, para gerenciar informações de pacientes.

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

Isso deve retornar as versões do **Node.js** e do  **npm** .

## Como rodar o projeto

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

### Pacientes

* `POST /api/pacientes` → Cadastrar novo paciente
* `GET /api/pacientes` → Listar todos os pacientes
* `GET /api/pacientes/:id` → Buscar paciente por ID
* `GET /api/pacientes/buscar/cpf?cpf=` → Buscar paciente por CPF
* `PUT /api/pacientes/:id` → Atualizar paciente
* `DELETE /api/pacientes/:id` → Deletar paciente
* `POST /api/pacientes/login` → Login do paciente
