/**
 * The Static Controller class
 *
 * @extends  Alchemy.Controller.App
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 * @param    {Object}    options
 */
var Static = Function.inherits('Alchemy.Controller.App', function Static(conduit, options) {
	Static.super.call(this, conduit, options);
});

/**
 * The home action
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
Static.setAction(async function home(conduit) {

	var PlayerScore = this.getModel('PlayerScore'),
	    options = {};

	if (conduit.param('session')) {
		options.session = conduit.param('session');
	}

	let result = await PlayerScore.getLeaderboard(options);

	this.set('players', result);
	this.set('bigscreen', false);

	// Render the leaderboard
	this.render('static/leaderboard');
});

/**
 * The leaderboard action
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
Static.setAction(async function leaderboard(conduit) {

	var PlayerScore = this.getModel('PlayerScore'),
	    options = {};

	if (conduit.param('session')) {
		options.session = conduit.param('session');
	}

	let result = await PlayerScore.getLeaderboard(options);

	this.set('players', result);
	this.set('bigscreen', true);

	// Render the leaderboard
	this.render('static/leaderboard');
});

/**
 * Show all the songs
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
Static.setAction(async function songs(conduit) {

	var Song = this.getModel('Song');

	this.set('songs', alchemy.ultrastar.getSongList());

	// Render the leaderboard
	this.render('static/songs');
});