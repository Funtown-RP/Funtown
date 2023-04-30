fx_version 'cerulean'
game 'gta5'

name 'Funtown [base]'
description "Funtown's core code"
author 'adoggman@github'

--loadscreen 'http://localhost/loadscreen'
--loadscreen_manual_shutdown 'no'

dependency 'ghmattimysql'

client_script 'dist/client/*.client.js'
server_script 'dist/server/*.server.js'

-- ui_page 'ui/build/index.html'
ui_page 'http://localhost/'

files {
	'ui/build/*.html',
	'ui/build/static/js/*.js',
	'ui/build/static/css/*.css',
	'ui/build/*.map'
}

-- dependency 'yarn'
-- dependency 'webpack'

-- webpack_config 'webpack.config.js'
