/**
 * The Song Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Song = Function.inherits('Alchemy.Model.Usdx', function Song(options) {
	Song.super.call(this, options);
});

/**
 * Set the table name
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Song.table = 'us_songs';

/**
 * Use ID as primary key
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Song.setProperty('primary_key', 'ID');

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Song.constitute(function addFields() {
	this.addField('ID',          'Number');
	this.addField('Artist',      'String');
	this.addField('Title',       'String');
	this.addField('TimesPlayed', 'Number');
	this.addField('Rating',      'Number');
});

/**
 * Load score info
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Song.setDocumentMethod(async function loadScores(refresh) {

	if (!refresh && this.$attributes.scores) {
		return this.$attributes.scores;
	}

	let Score = this.getModel('PlayerScore'),
	    crit = Score.find();

	crit.where('SongID').equals(this.ID);

	let records = await Score.find('all', crit),
	    scores = [];

	for (let record of records) {
		scores.push(record.Score);
	}

	scores = Math.removeOutliers(scores);

	let average = ~~Math.mean(scores),
	    median  = ~~Math.median(scores);

	let max = Math.max(...scores),
	    min = Math.min(...scores);

	this.$attributes.scores = {
		average : average || 0,
		median  : median || 0,
		max     : max || 0,
		min     : min || 0,
		scale   : Number.calculateNormalizeFactors(scores, [6000, 9600])
	};

	return this.$attributes.scores;
});

/**
 * Normalize a score
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Song.setDocumentMethod(async function normalizeScore(score) {

	let scores = await this.loadScores(false);

	let result = Math.ceil(Number.normalize([score], scores.scale)[0]);

	if (result < 6000) {
		return 6000;
	}

	return result;
});