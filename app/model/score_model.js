/**
 * The Score Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var PlayerScore = Function.inherits('Alchemy.Model.Usdx', function PlayerScore(options) {
	PlayerScore.super.call(this, options);
});

/**
 * Set the table name
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
PlayerScore.table = 'us_scores';

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
PlayerScore.constitute(function addFields() {
	this.addField('SongID',     'Number');
	this.addField('Difficulty', 'Number');
	this.addField('Player',     'String');
	this.addField('Score',      'Number');
	this.addField('Date',       'Date', {second_format: 1000});
	this.belongsTo('Song', {localKey: 'SongID'});
});

/**
 * Get top 10
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
PlayerScore.setMethod(async function getLeaderboard(options) {

	if (!options) {
		options = {};
	}

	if (!options.amount) {
		options.amount = 10;
	}

	if (!options.since) {
		options.since = 0;
	}

	if (!options.minimum_songs) {
		options.minimum_songs = 4;
	}

	if (options.age_penalty == null) {
		options.age_penalty = false;
	}

	let crit = this.find();

	if (options.since) {
		crit.where('Date').gte(options.since);
	}

	this.nukeCache();

	let scores = await this.find('all', crit),
	    players = {},
	    result = [],
	    player,
	    count,
	    name,
	    ago;

	let Song = this.getModel('Song');

	for (let score of scores) {

		if (score.Score < 6140) {
			continue;
		}

		if (!players[score.Player]) {
			players[score.Player] = {
				name   : score.Player,
				last   : null,
				scores : []
			};
		}

		player = players[score.Player];
		player.scores.push(score.Score);

		if (score.Date) {
			if (!player.last) {
				player.last = score.Date;
			} else if (score.Date > player.last) {
				player.last = score.Date;
			}
		}
	}

	for (name in players) {
		player = players[name];

		// Add 10.000 for outlier shenanigans
		// (removeOutliers also removes too high scores, but they should be kept)
		player.scores.push(10047);

		// Remove outliers (scores that are too low because of bad txt files)
		player.scores = Math.removeOutliers(player.scores);

		let index = player.scores.indexOf(10047);

		if (index > -1) {
			player.scores.splice(index, 1);
		}

		count = player.scores.length;

		// Only calculate if people have the correct minimum songs sung
		if (count < options.minimum_songs) {
			continue;
		}

		// Calculate days ago
		ago = ~~Date.difference('days', player.last);

		player.ago = ago;

		// People that haven't sung in over 4 years can be removed
		if (ago > 1460) {
			continue;
		}

		player.median = ~~Math.median(player.scores);
		player.mean = ~~Math.mean(player.scores);
		player.max = Math.max(...player.scores);
		player.min = Math.min(...player.scores);

		// Players with less songs sung will lose a percentage of their points
		player.penalty_count = ~~(player.mean * Math.pow(Math.pow(count, 2), -1));

		if (options.age_penalty) {
			// Players that haven't sung a song in a long time will also lose percentages
			player.penalty_ago = ~~(player.mean * (Math.max(Math.pow(ago, 1/4) - 1.5, 0) / 100));
		} else {
			player.penalty_ago = 0;
		}

		// And now our weighted average
		player.average = ~~((player.median + player.mean) / 2) - player.penalty_count - player.penalty_ago;

		result.push(player);

		// Look for the top song of this player
		for (let score of scores) {
			if (score.Player != name) {
				continue;
			}

			if (score.Score == player.max) {
				player.max_song = await Song.findById(score.SongID);
			}

			if (score.Score == player.min) {
				player.min_song = await Song.findById(score.SongID);
			}
		}
	}

	result.sortByPath(-1, 'average');

	for (let i = 0; i < result.length; i++) {
		result[i].rank = i + 1;
	}

	return result;
});