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

	// Because outliers are removed from the scores,
	// some values won't be taken into account in the scale
	// If that's the case, we need to clip those values manually
	if (score < scores.min) {
		return 6000;
	}

	if (score > scores.max) {
		return 9600;
	}

	let result = Math.ceil(Number.normalize([score], scores.scale)[0]);

	// When only 1 score is found for a song, the normalize functions returns
	// a NaN
	if (!result) {
		result = score;
	}

	if (result < 6000) {
		console.log('Score', score, result, 'is too low', scores, 'for song', this)
		return 6000;
	}

	if (result > 9600) {
		console.log('Score', score, result, 'is too high', scores)
		result = 9600;
	}

	return result;
});