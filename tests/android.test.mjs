import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=(path)=>fs.readFileSync(path,'utf8');
test('projeto Android é independente de Meu Ponto e só usa package ENADE',()=>{
 const gradle=read('android/app/build.gradle'),manifest=read('android/app/src/main/AndroidManifest.xml'),java=read('android/app/src/main/java/br/com/enade/eletrica/MainActivity.java');
 assert.match(gradle,/applicationId 'br.com.enade.eletrica'/);
 assert.match(manifest,/ENADE Elétrica 2026/);
 assert.doesNotMatch(gradle+manifest+java,/com\.meuponto|clioscope-updates\/main/);
 assert.match(java,/LOCAL_BASE \+ "index.html"/);
 assert.match(java,/getAssets\(\)\.open\(path\)/);
 assert.match(java,/setDomStorageEnabled\(true\)/);
 assert.match(java,/ACTION_CREATE_DOCUMENT/);
 assert.match(java,/onShowFileChooser/);
});
test('workflow compila, testa e disponibiliza APK somente na branch ENADE',()=>{
 const workflow=read('.github/workflows/build-enade-apk.yml');
 assert.match(workflow,/branches: \[enade-eletrica-2026\]/);
 assert.match(workflow,/gradle -p android :app:assembleDebug/);
 assert.match(workflow,/cp app\.html android\/app\/src\/main\/assets\/index\.html/);
 assert.match(workflow,/upload-artifact@v4/);
 assert.match(workflow,/ENADE-Eletrica-2026\.apk/);
 assert.doesNotMatch(workflow,/meu-ponto-app|MeuPonto-GitHub/);
 for(const size of [48,72,96,144,192])assert.ok(fs.existsSync(`android/app/src/main/res/mipmap-${({48:'mdpi',72:'hdpi',96:'xhdpi',144:'xxhdpi',192:'xxxhdpi'})[size]}/ic_launcher.png`));
});
test('HTML offline contém conteúdo avançado e ponte opcional de backup Android',()=>{
 const html=read('ENADE_Eletrica_2026_Teste_Offline.html');
 assert.match(html,/Cadernos didáticos/);
 assert.match(html,/CASO-014/);
 assert.match(html,/Verifique seu raciocínio/);
 assert.match(html,/AndroidBackup/);
 assert.match(html,/Aula aprofundada/);
});
