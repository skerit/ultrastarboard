console.log('Setting up reloader...');

setInterval(function doInterval() {
	console.log('reloading...')
	alchemy.openUrl('/');
}, 30 * 100000);

hawkejs.scene.appears('js-make-sortable', {live: true}, function gotTable(table) {

	table.classList.add('sortable');

	sorttable.makeSortable(table);
});