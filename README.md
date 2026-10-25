# Cifra Livre (protótipo navegável 0.2.0)

App de cifras original, offline e sem anúncios. Núcleo em JavaScript puro (`src/core.js`), interface web responsiva (`src/index.html`) conforme a "Especificação Técnica da Interface", e empacotamento Android via Capacitor.

## Rodar
- `npm test` — testes do núcleo (acordes, transposição, tom, importação .txt, busca).
- `npm run build` — gera `www/` e `dist/cifra-livre.html` (arquivo único, abre no navegador).
- Android: envie ao GitHub; o workflow `.github/workflows/android.yml` gera o APK de debug (artefato `cifras-catolicas-debug-apk`).

## Telas implementadas
Minhas músicas (pastas, recentes, repertórios), Procurar música (local), Visualizador (transposição, tom direto, rolagem, fonte, tela cheia), Editor (seções, aviso de alterações não salvas), Minhas listas (tom do evento, observações, ensaio, reordenar), Modo Palco, Importar (.txt), Backup e restauração, Preferências (temas claro/escuro/alto contraste), Ajuda, Sobre.
Indisponíveis e sinalizados como tal: Recursos musicais, Integrações, pesquisa online, notação por solfejo.

## Conteúdo e licenças
O app não acessa sites de cifras e não traz acervo. Use apenas textos de sua autoria, de domínio público ou com licença expressa; cada música guarda `source` e `license`.

## Fora desta versão
Windows 11 (próxima fase), SQLite/FTS5, ChordPro, arrastar-e-soltar, vínculo de áudio, cores personalizáveis do acorde, ícones definitivos, protótipo de alta fidelidade.
