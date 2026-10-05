const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Função auxiliar para formatar o tempo de atividade (Uptime)
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// Função para obter o IP principal da máquina
function getMainIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

function getNetworkScope(ip) {
  if (!ip) return 'Desconhecido';
  if (ip === '127.0.0.1') return 'Loopback';
  const firstOctet = Number(ip.split('.')[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return 'Privado (Classe A)';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Privado (Classe B)';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Privado (Classe C)';
  if (firstOctet >= 224) return 'Multicast / especial';
  return 'Público';
}

// Função para listar ficheiros no diretório do projeto
function getProjectFiles() {
  try {
    const projectPath = process.cwd();
    const files = fs.readdirSync(projectPath);
    return files.map(file => {
      const filePath = path.join(projectPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        type: stats.isDirectory() ? 'Dir' : 'Arquivo',
        size: stats.isDirectory() ? '-' : `${(stats.size / 1024).toFixed(2)} KB`
      };
    });
  } catch (err) {
    return [];
  }
}

// Rota da API com todas as métricas detalhadas
app.get('/api/system', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramUsagePercent = Math.round((usedMem / totalMem) * 100);

  const cpus = os.cpus();
  let totalCpuUsage = 0;

  const coreDetails = cpus.map((cpu, index) => {
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
    const idle = cpu.times.idle;
    const usage = Math.round(((total - idle) / total) * 100);
    totalCpuUsage += usage;
    return { core: index, usage };
  });

  const cpuAvgUsage = Math.round(totalCpuUsage / cpus.length);

  // Formatação das interfaces de rede
  const rawInterfaces = os.networkInterfaces();
  const networkInterfacesList = [];
  for (const [iface, details] of Object.entries(rawInterfaces)) {
    details.forEach(detail => {
      const networkMask = detail.netmask || '255.255.255.0';
      networkInterfacesList.push({
        iface,
        ip: detail.address,
        family: detail.family,
        mac: detail.mac || 'N/A',
        mask: networkMask,
        scope: getNetworkScope(detail.address)
      });
    });
  }

  const files = getProjectFiles();
  const mainIp = getMainIP();
  const isCloud = !!process.env.RENDER || !!process.env.AWS_EXECUTION_ENV;

  res.json({
    kpis: {
      ramPercent: ramUsagePercent,
      cpuAvgPercent: cpuAvgUsage,
      uptimeFormatted: formatUptime(os.uptime()),
      filesCount: files.length,
      mainIp: mainIp,
      status: 'NORMAL'
    },
    sistema: {
      hostname: os.hostname(),
      so: os.type(),
      release: os.release(),
      platform: os.platform(),
      arch: os.arch(),
      endianness: os.endianness(),
      nodeVersion: process.version,
      path: process.env.PATH || process.env.Path || 'N/A',
      tempDir: os.tmpdir()
    },
    usuario: {
      username: os.userInfo().username,
      homedir: os.homedir(),
      tmpdir: os.tmpdir(),
      shell: process.env.SHELL || 'N/A',
      uid: os.userInfo().uid,
      gid: os.userInfo().gid
    },
    memoria: {
      totalGB: (totalMem / (1024 ** 3)).toFixed(2),
      usedGB: (usedMem / (1024 ** 3)).toFixed(2),
      freeGB: (freeMem / (1024 ** 3)).toFixed(2),
      perCpuGB: (totalMem / (1024 ** 3) / cpus.length).toFixed(2),
      usagePercent: ramUsagePercent
    },
    cpu: {
      coresCount: cpus.length,
      model: cpus[0].model,
      loadAvg: os.loadavg().map(n => n.toFixed(2)),
      cores: coreDetails
    },
    rede: {
      mainIp: mainIp,
      interfacesCount: Object.keys(rawInterfaces).length,
      list: networkInterfacesList
    },
    arquivos: files,
    tempo: {
      uptimeFormatted: formatUptime(os.uptime()),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isoDate: new Date().toISOString()
    },
    aplicacao: {
      pid: process.pid,
      cwd: process.cwd(),
      nodeMemMB: (process.memoryUsage().rss / (1024 * 1024)).toFixed(2),
      execPath: process.execPath
    },
    ambiente: {
      status: isCloud ? 'Executando no Render (Cloud)' : 'Executando Localmente',
      port: PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      kernelAws: os.release().includes('aws') ? 'Sim' : 'Não'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a executar em http://localhost:${PORT}`);
});