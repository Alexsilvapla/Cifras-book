(function (root) {
  'use strict';
  const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const CHORD = /^([A-G][#b]?)((?:maj|min|dim|aug|sus|add|m|M|[+°º\-#b()0-9])*)(?:\/([A-G][#b]?))?$/;
  const NEUTRAL = /^(?:[|/\\.:()\-–—]+|\(?\d+x\)?|x\d+)$/i;
  const semi = (n) => (SEMI[n[0]] + (n[1] === '#' ? 1 : n[1] === 'b' ? -1 : 0) + 12) % 12;
  const spell = (v, flat) => (flat ? FLAT : SHARP)[((v % 12) + 12) % 12];
  const isChordToken = (t) => CHORD.test(t);
  function tokens(line) {
    const out = [], re = /\S+/g; let m;
    while ((m = re.exec(line))) out.push({ t: m[0], i: m.index });
    return out;
  }
  function isChordLine(line) {
    const ts = tokens(line).filter((x) => !NEUTRAL.test(x.t));
    if (!ts.length) return false;
    return ts.filter((x) => isChordToken(x.t)).length / ts.length >= 0.6;
  }
  function style(text) {
    let f = 0, s = 0;
    for (const l of text.split(/\r?\n/)) {
      if (!isChordLine(l)) continue;
      for (const k of tokens(l)) {
        const m = CHORD.exec(k.t); if (!m) continue;
        for (const r of [m[1], m[3]]) if (r) { if (r[1] === 'b') f++; else if (r[1] === '#') s++; }
      }
    }
    return f > s ? 'flat' : 'sharp';
  }
  function moveRoot(r, n, policy, def) {
    const flat = policy === 'flat' ? true : policy === 'sharp' ? false : r[1] === 'b' ? true : r[1] === '#' ? false : def === 'flat';
    return spell(semi(r) + n, flat);
  }
  function transposeToken(t, n, policy, def) {
    const m = CHORD.exec(t); if (!m) return t;
    return moveRoot(m[1], n, policy, def) + m[2] + (m[3] ? '/' + moveRoot(m[3], n, policy, def) : '');
  }
  function transposeLine(line, n, policy, def) {
    if (!n && policy === 'keep') return line;
    if (!isChordLine(line)) return line;
    let out = '';
    for (const { t, i } of tokens(line)) {
      const r = isChordToken(t) ? transposeToken(t, n, policy, def) : t;
      if (out.length < i) out += ' '.repeat(i - out.length); else if (out) out += ' ';
      out += r;
    }
    return out;
  }
  function transposeText(text, n, policy) {
    const lines = String(text).replace(/\r\n?/g, '\n').split('\n'), def = style(text);
    return lines.map((l) => transposeLine(l, n | 0, policy || 'keep', def)).join('\n');
  }
  const normalize = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rootOf = (c) => { const m = CHORD.exec(c); return m ? m[1] : null; };
  const keyOffset = (a, b) => (semi(rootOf(b)) - semi(rootOf(a)) + 12) % 12;
  function parseTxt(name, text) {
    const base = String(name).replace(/\.[^.]+$/, '').replace(/_+/g, ' ').trim();
    const m = /^(.+?)\s+-\s+(.+)$/.exec(base);
    const body = String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\s+$/, '');
    return { artist: m ? m[1].trim() : '', title: m ? m[2].trim() : base, body, ok: body.trim().length > 0, warn: body.includes('\uFFFD') };
  }
  const api = { isChordToken, isChordLine, transposeLine, transposeText, normalize, keyOffset, parseTxt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Core = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
