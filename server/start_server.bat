@echo off
echo Starting local backend server...
cd /d %~dp0
node -e "try { require('./dist/index.js'); console.log('Backend started from compiled version'); } catch(e) { console.log('No compiled version, using tsx...'); require('tsx').watch('src/index.ts'); }"