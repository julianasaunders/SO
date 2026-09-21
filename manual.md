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

# 📊 Análise Comparativa e Teórica: Execução Local vs. Nuvem

---

## 1. Comparação de Informações: Local vs. Cloud (Render)

Abaixo está a comparação detalhada entre as saídas retornadas pelo módulo `os` da aplicação ao ser executada na máquina física local e no ambiente de nuvem do Render:

| Informação / Recurso | Execução Local (PC Físico) | Execução Cloud (Render - PaaS) | Diferença Técnica Observada |
| :--- | :--- | :--- | :--- |
| **Hostname (`os.hostname`)** | Ex.: `DESKTOP-8G4V2A1` ou `notebook-user` | Ex.: `srv-d1f89c0a-xxxx` | O host local reflete a identificação atribuída na rede local; na nuvem, o nome é um identificador alfanumérico único gerado dinamicamente pelo orquestrador de contêineres/VMs. |
| **Plataforma (`os.platform`)** | `win32` (Windows) | `linux` | A máquina local executa o sistema operacional de desenvolvimento da estação de trabalho; o Render executa distribuições Linux otimizadas para servidores em nuvem. |
| **Arquitetura (`os.arch`)** | `x64` | `x64` | Ambos utilizam a arquitetura x86-64 (AMD64) para processamento de 64 bits. |
| **Memória RAM Total** | Ex.: `8192 MB` a `16384 MB` (~8 GB a 16 GB) | `512 MB` | A máquina local reporta a capacidade física total dos pentes de memória instalados; a nuvem limita rigidamente a memória disponível conforme a cota do plano gratuito (*Free Tier*). |
| **Memória RAM Livre** | Ex.: `3500 MB` a `7000 MB` | Ex.: `120 MB` a `250 MB` | No ambiente local a RAM é disputada por aplicações do usuário (navegadores, IDEs); no Render, o contêiner disponibiliza apenas a margem delimitada pelo grupo de controle (*cgroups*) do kernel. |
| **CPUs (`os.cpus().length`)** | Ex.: `4`, `8` ou `16` núcleos | `1` ou `2` vCPUs | O ambiente local enxerga todos os núcleos físicos e lógicos (threads de hardware) do processador; a nuvem atribui núcleos virtuais (*vCPUs*), que compartilham fatias de tempo da CPU física hospedeira. |
| **Uptime (`os.uptime`)** | Horas ou dias de atividade | Poucos minutos (reinicia a cada deploy/inatividade) | A máquina local reflete o tempo desde o último ligamento do computador; na nuvem, a instância gratuita entra em modo de suspensão (*spin-down*) após inatividade e zera o contador a cada nova subida. |

---

## 2. Relação com os Conceitos de Sistemas Operacionais

### ⚙️ 2.1. Processos e Threads
* **Criação do Processo:** Ao executar `node index.js`, o SO hospedeiro cria um **processo** com seu próprio espaço de endereçamento virtual isolado, tabela de descritores de arquivos e um identificador único de processo (PID).
* **Estrutura de Execução:** O Node.js executa a lógica JavaScript em uma **thread principal** (*Single-Threaded Event Loop*), mas delega chamadas do sistema de arquivos e rotinas de Entrada/Saída do módulo `os` para a biblioteca `libuv`, que gerencia um pool de **threads secundárias** em segundo plano.

---

### 💾 2.2. Gerenciamento de Memória e Chamadas de Sistema (*System Calls*)
* **Abstração da Memória:** Os métodos `os.totalmem()` e `os.freemem()` não acessam os circuitos elétricos da RAM diretamente; eles realizam **chamadas de sistema (*System Calls*)** solicitando ao Kernel que consulte suas tabelas de gerenciamento de páginas de memória.
* **Isolamento e Segurança:** O Kernel do SO atua em **Modo Kernel (Ring 0)** protegendo as regiões de memória de outros processos em execução, enquanto o script Node.js opera estritamente em **Modo Usuário (Ring 3)**, impedindo corrupção direta de memória física.

---

### ⏳ 2.3. Uso de CPU e Escalonamento
* **Local:** O escalonador de tarefas do SO local distribui as instruções do processo Node.js diretamente entre os núcleos e threads físicas do processador.
* **Cloud:** No servidor da nuvem, a métrica `os.cpus()` reflete uma **vCPU (CPU Virtual)**. O Hypervisor ou o kernel hospedeiro da nuvem utiliza algoritmos de escalonamento por fatia de tempo (*time-sharing*) para alternar a CPU física entre centenas de outros contêineres de clientes diferentes.

---

### 🖥️ 2.4. Sistema Operacional Hospedeiro (*Host OS*)
* **Camada de Abstração:** O Sistema Operacional hospedeiro atua como a interface intermediária essencial. 
* **Portabilidade:** Embora o código-fonte em JavaScript seja rigorosamente o mesmo, ele interage com APIs de sistemas operacionais hospedeiros totalmente diferentes (`win32` no desenvolvimento e `linux` na nuvem) sem necessidade de reescrita, demonstrando a função do SO e do interpretador em padronizar o acesso aos recursos da máquina.

---

### 📦 2.5. Virtualização e Contêineres
* **Ambiente em Nuvem (Render):** O Render provisiona a aplicação utilizando a tecnologia de **contêineres** (baseada no kernel Linux).
* **Diferença de Abstração:** Ao invés de emular uma máquina virtual completa com seu próprio hardware simulado (como faz o VirtualBox), o contêiner empacota apenas a aplicação e suas dependências, compartilhando o **mesmo Kernel do SO hospedeiro** através de *namespaces* (para isolar rede e processos) e *cgroups* (para limitar o teto de 512 MB de RAM e cotas de CPU).

---

### ☁️ 2.6. Computação em Nuvem
* **Modelo de Serviço (PaaS):** O Render atua como *Platform as a Service* (Plataforma como Serviço). Não há necessidade de gerenciar atualizações do kernel, drivers ou segurança física; o foco fica restrito à aplicação e dependências.
* **Elasticidade e Recursos sob Demanda:** Em vez de alocar um servidor físico dedicado (modelo tradicional com custos de CAPEX), a aplicação utiliza infraestrutura em nuvem sob demanda com tarifação baseada em uso operacional (OPEX) e desligamento automático quando não há requisições ativas.

---

## 🎯 3. Conclusão Final

A realização desta atividade permitiu observar, de forma empírica e prática, como a camada de abstração implementada pelos Sistemas Operacionais é determinante para o desenvolvimento de aplicações contemporâneas.

1. **Eficiência da Abstração:** O código desenvolvido em Node.js manteve uma consistência funcional perfeita tanto em Windows como em Linux, comprovando que as APIs padronizadas e o runtime isolam o programador da complexidade do hardware subjacente.
2. **Impacto da Virtualização e Controlo de Recursos:** A transição do ambiente local para o Render (PaaS) evidenciou as diferenças intrínsecas entre hardware dedicado e computação partilhada multi-tenant. Mecanismos de controlo do kernel (como os *cgroups* no Linux) tornam possível limitar o consumo de CPU e RAM com precisão milimétrica, viabilizando o modelo de negócio da computação em nuvem.
3. **Relevância para a Engenharia de Software:** Compreender o ciclo de chamadas de sistema, a gestão de memória e a partilha do kernel entre contentores desmistifica o conceito de "nuvem", evidenciando que esta assenta, fundamentalmente, em técnicas consolidadas de sistemas operativos orientadas para a escalabilidade, portabilidade e otimização de custos operacionais.
