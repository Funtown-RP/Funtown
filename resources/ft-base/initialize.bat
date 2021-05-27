@echo off
npm install && npm run build && cd ./ui/ && yarn install && yarn run build