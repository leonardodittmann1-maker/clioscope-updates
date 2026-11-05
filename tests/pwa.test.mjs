import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
test('PWA possui ícones Android 192 e 512 no manifesto, arquivo HTML e cache offline',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
 for(const size of [192,512]){
  const ref=manifest.icons.find(i=>i.sizes===`${size}x${size}`&&i.type==='image/png');assert.ok(ref,`${size} manifest`);
  const icon=fs.readFileSync(path.join(root,ref.src));
  assert.equal(icon.subarray(1,4).toString(),'PNG');
  assert.equal(icon.readUInt32BE(16),size);assert.equal(icon.readUInt32BE(20),size);
  assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes(`icon-${size}.png`));
 }
 assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/rel="manifest"/);
});
