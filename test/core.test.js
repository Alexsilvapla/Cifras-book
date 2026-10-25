const test = require('node:test'), assert = require('node:assert');
const C = require('../src/core.js');
test('tokens de acorde', () => {
  for (const t of ['A','Am7','C#m','Bb','F#m7b5','E7(b9)','G/B','Dsus4','Cmaj7','Bb°','Em']) assert.ok(C.isChordToken(t), t);
  for (const t of ['casa','Bem','Dim','Ela','a','x2','Cab']) assert.ok(!C.isChordToken(t), t);
});
test('linha de acordes vs letra', () => {
  assert.ok(C.isChordLine('C   G   Am  F'));
  assert.ok(C.isChordLine('| C  G  |  (2x)'));
  assert.ok(!C.isChordLine('Em casa'));
  assert.ok(!C.isChordLine('Eu vou de A para B'));
});
test('transposição mantém colunas', () => {
  assert.strictEqual(C.transposeLine('C  G  Am  F', 2, 'keep', 'sharp'), 'D  A  Bm  G');
  assert.strictEqual(C.transposeLine('C/G', 2, 'keep', 'sharp'), 'D/A');
});
test('políticas de acidentes', () => {
  assert.strictEqual(C.transposeLine('A', 1, 'sharp', 'sharp'), 'A#');
  assert.strictEqual(C.transposeLine('A', 1, 'flat', 'sharp'), 'Bb');
  assert.strictEqual(C.transposeText('Bb  F\nletra', -2, 'keep'), 'Ab  Eb\nletra');
});
test('letra não muda e volta ao original após 12 semitons', () => {
  const t = 'C   G/B  Am7\nLetra aqui em casa\nF   Dm';
  assert.strictEqual(C.transposeText(t, 12, 'keep'), t);
  assert.strictEqual(C.transposeText(t, 3, 'keep').split('\n')[1], 'Letra aqui em casa');
  const w = 'C      G/B      Am7\nLetra aqui em casa\nF      Dm'; // espaçamento folgado: sem colisão de colunas
  for (let n = -11; n <= 11; n++) assert.strictEqual(C.transposeText(C.transposeText(w, n, 'sharp'), -n, 'sharp'), w);
});
test('busca sem acento', () => assert.strictEqual(C.normalize('Cláudio'), 'claudio'));
test('tom: deslocamento entre tonalidades', () => {
  assert.strictEqual(C.keyOffset('C', 'E'), 4);
  assert.strictEqual(C.keyOffset('Em', 'C'), 8);
  assert.strictEqual(C.keyOffset('Bb', 'A#'), 0);
});
test('importação de .txt', () => {
  assert.deepStrictEqual(C.parseTxt('Artista - Título.txt', '\uFEFFC  G\r\nletra\r\n\r\n'), { artist: 'Artista', title: 'Título', body: 'C  G\nletra', ok: true, warn: false });
  assert.strictEqual(C.parseTxt('vazio.txt', '  \n').ok, false);
  assert.strictEqual(C.parseTxt('so_titulo.txt', 'x').title, 'so titulo');
});

test('importação preserva acentos e remove espaços finais', () => {
  const x = C.parseTxt('João da Silva - Canção bonita.pro', '\uFEFFC\nletra com acentuação  \n');
  assert.strictEqual(x.artist, 'João da Silva');
  assert.strictEqual(x.title, 'Canção bonita');
  assert.strictEqual(x.body, 'C\nletra com acentuação');
  assert.strictEqual(x.ok, true);
  assert.strictEqual(x.warn, false);
});
test('importação sinaliza texto com caracteres substitutos', () => {
  const x = C.parseTxt('arquivo.crd', 'C\nletra � inválida');
  assert.strictEqual(x.warn, true);
});
test('importação sem artista usa o nome do arquivo como título', () => {
  const x = C.parseTxt('  Santo_Espírito.txt', 'G\nVem sobre nós');
  assert.strictEqual(x.artist, '');
  assert.strictEqual(x.title, 'Santo Espírito');
  assert.strictEqual(x.ok, true);
});
test('transposição de acordes com baixo mantém o formato', () => {
  assert.strictEqual(C.transposeLine('D/F#  G/B', 2, 'sharp', 'sharp'), 'E/G#  A/C#');
});
test('linhas de letra não são alteradas pela transposição', () => {
  const lyrics = 'A beleza está em cada detalhe, eu vou cantar';
  assert.strictEqual(C.transposeLine(lyrics, 5, 'sharp', 'sharp'), lyrics);
});
test('normalização de pesquisa ignora caixa e acentos', () => {
  assert.strictEqual(C.normalize('MÚSICA São João'), 'musica sao joao');
});
