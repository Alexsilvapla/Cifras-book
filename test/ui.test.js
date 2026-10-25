const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');

test('interface em português e navegação principal', () => {
  assert.match(html, /<html lang="pt-BR">/);
  for (const label of ['Minhas músicas', 'Artistas', 'Favoritas', 'Repertórios', 'Procurar música', 'Importar arquivos', 'Backup e restauração', 'Preferências', 'Recursos musicais', 'Modo Palco']) {
    assert.ok(html.includes(label), 'Item de navegação ausente: ' + label);
  }
});

test('favoritas têm tela, ação e persistência', () => {
  assert.match(html, /S\.favorites\s*=/);
  assert.match(html, /A\.togglefav\s*=/);
  assert.match(html, /favorite:\s*!!o\.favorite/);
  assert.match(html, /Adicionar às favoritas/);
});

test('recursos musicais estão presentes na interface', () => {
  for (const label of ['Dicionário de acordes para violão', 'Metrônomo', 'Afinador cromático']) {
    assert.ok(html.includes(label), 'Recurso ausente: ' + label);
  }
});

test('visualizador mantém controles essenciais de cifra', () => {
  for (const action of ['addlist', 'share', 'copytext', 'ton', 'fs', 'play', 'full', 'pv', 'nx']) {
    assert.ok(html.includes('data-a="' + action + '"') || html.includes("data-a=\\""+action+"\\""), 'Ação não encontrada no HTML: ' + action);
  }
});

test('filtro de importação ZIP reconhece extensões de cifra', () => {
  assert.ok(html.includes(String.raw`!(/\\.(txt|cho|pro|crd)$/i)`));
});

test('HTML usa tags de scripts esperadas pelo build', () => {
  assert.ok(html.includes('<script src="jszip.min.js"></script>'));
  assert.ok(html.includes('<script src="core.js"></script>'));
});
