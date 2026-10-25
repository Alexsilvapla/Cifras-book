const fs=require('fs');
fs.rmSync('www',{recursive:true,force:true});fs.mkdirSync('www');fs.mkdirSync('dist',{recursive:true});
for(const f of ['index.html','core.js'])fs.copyFileSync('src/'+f,'www/'+f);\nfs.copyFileSync('node_modules/jszip/dist/jszip.min.js','www/jszip.min.js');
const html=fs.readFileSync('src/index.html','utf8'),core=fs.readFileSync('src/core.js','utf8');
fs.writeFileSync('dist/cifra-livre.html',html.replace('<script src="jszip.min.js"></script>','<script>'+fs.readFileSync('node_modules/jszip/dist/jszip.min.js','utf8')+'</script>').replace('<script src="core.js"></script>',()=>'<script>'+core+'</script>'));
console.log('ok: www/ e dist/cifra-livre.html');
