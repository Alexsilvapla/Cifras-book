const fs = require('node:fs');

const root = process.cwd();
const sourceDir = 'src';
const jszipPath = 'node_modules/jszip/dist/jszip.min.js';
const htmlPath = sourceDir + '/index.html';
const corePath = sourceDir + '/core.js';

for (const path of [htmlPath, corePath, jszipPath]) {
  if (!fs.existsSync(path)) {
    throw new Error('Arquivo necessário para o build não encontrado: ' + path);
  }
}

const sourceHtml = fs.readFileSync(htmlPath, 'utf8');
const core = fs.readFileSync(corePath, 'utf8');
const jszip = fs.readFileSync(jszipPath, 'utf8');

const jszipTag = '<script src="jszip.min.js"></script>';
const coreTag = '<script src="core.js"></script>';

if (!sourceHtml.includes(jszipTag) || !sourceHtml.includes(coreTag)) {
  throw new Error('Não foi possível incorporar as bibliotecas: tags de script esperadas não encontradas em src/index.html.');
}

const standaloneHtml = sourceHtml
  .replace(jszipTag, () => '<script>\n' + jszip + '\n</script>')
  .replace(coreTag, () => '<script>\n' + core + '\n</script>');

fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www', { recursive: true });
fs.mkdirSync('dist', { recursive: true });

fs.copyFileSync(htmlPath, 'www/index.html');
fs.copyFileSync(corePath, 'www/core.js');
fs.copyFileSync(jszipPath, 'www/jszip.min.js');
fs.writeFileSync('dist/cifra-livre.html', standaloneHtml, 'utf8');

console.log('Build concluído: www/ e dist/cifra-livre.html');
