/**
 * The Ultrastar parser
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    1.0.0
 * @version  1.0.0
 */
var Ultrastar = Function.inherits('Alchemy.Base', function Ultrastar(options) {

	if (!options) {
		options = {};
	}

	// Store the options
	this.options = options;

	// All the songs
	this.songs = [];
});

/**
 * Scan the song directory
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    1.0.0
 * @version  1.0.0
 */
Ultrastar.setMethod(async function scanDir(path) {

	let files = await alchemy.readDir(path, {recursive: true}),
	    songs = [],
	    Song = Model.get('Song');

	for (let entry of files) {
		if (entry.is_directory) {
			checkDirectory(entry);
		}
	}

	function checkDirectory(dir) {

		if (dir.contains(/\.txt$/i) && dir.contains(/\.mp3$/i)) {
			songs.push(dir);
		} else {
			for (let entry of dir.contents) {
				if (entry.is_directory) {
					checkDirectory(entry);
				}
			}
		}
	}

	for (let song of songs) {
		let pieces = song.name.split('-');

		if (!pieces || !pieces.length == 2) {
			continue;
		}

		let artist = pieces[0].trim(),
		    title = pieces[1].trim();

		let crit = Song.find();

		crit.where('Title').equals(title + '\u0000');
		crit.where('Artist').equals(artist + '\u0000');

		let record = await Song.find('first', crit);

		song.artist = artist;
		song.title = title;

		if (record) {
			song.record = record;
			let scores = await record.loadScores();
			song.scores = scores;
		}
	}

	this.songs = songs;
});

/**
 * Get a list of song names
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    1.0.0
 * @version  1.0.0
 */
Ultrastar.setMethod(function getSongList() {

	var result = [];

	for (let dir of this.songs) {
		let entry = {
			artist : dir.artist,
			title  : dir.title
		};

		if (dir.record) {
			entry.id = dir.record.ID;
			entry.played = dir.record.TimesPlayed;

			if (dir.scores && isFinite(dir.scores.min)) {
				entry.max = dir.scores.max;
				entry.min = dir.scores.min;
				entry.average = dir.scores.average;
			}
		}

		result.push(entry);
	}

	result.sortByPath(1, 'artist', 'title');

	return result;
});