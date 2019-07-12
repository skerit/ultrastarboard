
setInterval(function doInterval() {

	let songs = document.querySelector('.board.songs');

	// Don't refresh songs page
	if (songs) {
		return;
	}

	alchemy.openUrl(''+window.location);
}, 30 * 1000);

hawkejs.scene.appears('js-make-sortable', {live: true}, function gotTable(table) {

	table.classList.add('sortable');

	sorttable.makeSortable(table);
});