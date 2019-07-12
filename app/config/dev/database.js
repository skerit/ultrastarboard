// Create the 'default' datasource of type 'mongo'
// Datasource.create('mongo', 'default', {
// 	host      : '127.0.0.1',
// 	database  : 'ultrastarboard_dev',
// 	login     : false,
// 	password  : false
// });

Datasource.create('sqlite3', 'usdx', {
	//path : PATH_TEMP + '/ultrastar.db',
	path : '/media/bridge/ultrastar/profile/Ultrastar.db',
	read   : true,
	create : false,
	update : false,
	remove : false
});