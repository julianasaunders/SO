# 🖥️ Monitor de Sistemas Operacionais

Aplicação simples desenvolvida com **Node.js** e **Express** para monitoramento básico do sistema operacional do servidor utilizando o módulo nativo `os`.

A aplicação exibe informações do servidor diretamente no navegador.

---

## 🚀 Funcionalidades

* Exibe o hostname da máquina
* Mostra a plataforma do sistema operacional
* Exibe a arquitetura da CPU
* Mostra memória total e memória livre
* Quantidade de CPUs disponíveis
* Tempo de atividade do servidor (uptime)

---

## 🛠️ Tecnologias Utilizadas

* Node.js
* Express
* Módulo nativo `os`

---

## 📂 Estrutura do Projeto

```bash
.
├── index.js
├── package.json
└── README.md
```

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

Entre na pasta do projeto:

```bash
cd seu-repositorio
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Executando Localmente

Inicie o servidor:

```bash
node index.js
```

O servidor ficará disponível em:

```bash
http://localhost:3000
```

---

## ☁️ Deploy no Render

### 1. Crie uma conta

Acesse:

* https://render.com

---

### 2. Crie um novo Web Service

* Clique em **New +**
* Escolha **Web Service**
* Conecte seu repositório GitHub

---

### 3. Configurações do Deploy

Use as seguintes configurações:

| Configuração  | Valor         |
| ------------- | ------------- |
| Environment   | Node          |
| Build Command | npm install   |
| Start Command | node index.js |

---

### 4. Variável de Porta

O projeto já utiliza:

```js
const PORT = process.env.PORT || 3000;
```

Isso permite que o Render defina automaticamente a porta da aplicação.

---

## 📄 Código Principal

```js
const express = require('express');
const os = require('os');

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h1>Monitor de Sistemas Operacionais</h1>
    <p><strong>Hostname:</strong> ${os.hostname()}</p>
    <p><strong>Plataforma:</strong> ${os.platform()}</p>
    <p><strong>Arquitetura:</strong> ${os.arch()}</p>
    <p><strong>Memória Total:</strong> ${Math.round(os.totalmem()/1024/1024)} MB</p>
    <p><strong>Memória Livre:</strong> ${Math.round(os.freemem()/1024/1024)} MB</p>
    <p><strong>CPUs:</strong> ${os.cpus().length}</p>
    <p><strong>Uptime:</strong> ${Math.round(os.uptime()/60)} minutos</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
```

---

## 📸 Exemplo da Página

A aplicação exibirá algo semelhante a:

```bash
Monitor de Sistemas Operacionais

Hostname: servidor-render
Plataforma: linux
Arquitetura: x64
Memória Total: 2048 MB
Memória Livre: 1024 MB
CPUs: 2
Uptime: 120 minutos
```

---

## 👨‍💻 Autor

Projeto desenvolvido para fins de estudo com Node.js e monitoramento básico de sistemas operacionais.
