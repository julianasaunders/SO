# 🚀 Manual Completo: Do Desenvolvimento Local ao Deploy no Render

---

## 🛠️ Parte 1: Criando a API REST com Express

### 1. Inicializando o Projeto
Crie uma nova pasta para o seu projeto no computador e abra essa pasta no VS Code.

### 2. Instale o Express.js
No terminal integrado do VS Code, instale o pacote do Express:
```
npm install express
```
### 3. Instale o CORS
Instale o módulo do CORS para gerenciar as permissões de acesso:
```
npm install cors express
```
💡 O que é CORS?

O CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança que controla o acesso e compartilhamento de recursos entre domínios diferentes no navegador web.

### 4. Criando o Arquivo Principal
Crie o arquivo index.js na raiz do seu projeto seguindo o modelo base da disciplina:   
```
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
### 5. Executando o Servidor Localmente
Inicie a sua aplicação para testar no computador:   
```
node index.js
```
Abra o navegador no endereço indicado (por padrão http://localhost:3000) para validar se os dados estão sendo exibidos corretamente.

## ☁️ Parte 2: Publicação e Deploy no Render
### 1. Commit do Projeto no GitHub
Deixe o seu projeto disponível em um repositório no GitHub:   
```
git init
git add .
git commit -m "Commit inicial do projeto"
git branch -M main
git remote add origin [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
git push -u origin main
```
### 2. Criando a Conta no Render
Acesse a plataforma em dashboard.render.com e faça o login (preferencialmente utilizando sua conta do GitHub).   

### 3. Crie um Novo "Web Service"
Clique no botão New + no painel principal.   

Escolha a opção Web Service.   

Conecte e selecione o repositório do GitHub criado na etapa anterior.   

### 4. Defina os Comandos de Start
Configure as instruções de inicialização do serviço com os seguintes valores:   
```
Build Command: node (ou npm install)   

Start Command: node index.js
```
### 5. Deploy do Web Service
Clique em Deploy Web Service para iniciar a publicação.   


Após finalizar a compilação, o sistema estará ativo e acessível através da URL fornecida:

Plaintext
[https://seu-projeto.onrender.com](https://seu-projeto.onrender.com)
