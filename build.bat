@echo off
cd %~dp0/resources/ft-base/ui && yarn build && cd .. && npm run build && cd %~dp0 && pause