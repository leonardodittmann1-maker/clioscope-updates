import fs from 'node:fs';
const files=['model.js','official.js','advanced.js','formulae.js','advancedLessons.js','content.js','sync.js','store.js','main.js'];
let js=files.map(f=>fs.readFileSync(`dist/assets/${f}`,'utf8').replace(/^import .*?;\s*$/gm,'').replace(/^export /gm,'')).join('\n');
js=js.replace("if ('serviceWorker' in navigator && location.protocol.startsWith('http'))\n    navigator.serviceWorker.register('/sw.js').catch(() => { });",'');
const css=fs.readFileSync('dist/assets/styles.css','utf8');
const doc=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ENADE Elétrica 2026 — Teste local</title><meta name="description" content="Aplicativo offline para estudo"><style>${css}</style></head><body><div id="app"></div><script>${js}</script></body></html>`;
fs.writeFileSync('ENADE_Eletrica_2026_Teste_Offline.html',doc);
console.log('Arquivo HTML autossuficiente criado:',Buffer.byteLength(doc),'bytes');
