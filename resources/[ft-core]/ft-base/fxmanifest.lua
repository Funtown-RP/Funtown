fx_version 'bodacious'
game 'gta5'

name 'Funtown [base]'
description "Funtown's core code"
author 'adoggman@github'
-- url 'https://github.com/d0p3t/fivem-ts-boilerplate'

-- loadscreen 'https://hostrider.com/'

dependency 'ghmattimysql'

client_script 'dist/client/*.client.js'
server_script 'dist/server/*.server.js'

ui_page 'ui/build/index.html'
files {
	'ui/build/index.html',
	'ui/build/static/js/*.js',
	'ui/build/static/css/*.css'
}

-- dependency 'yarn'
-- dependency 'webpack'

-- webpack_config 'webpack.config.js'
