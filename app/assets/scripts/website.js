console.log('Setting up reloader...');

setInterval(function doInterval() {
	console.log('reloading...')
	alchemy.openUrl('/');
}, 30 * 1000);