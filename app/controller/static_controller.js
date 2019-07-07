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

	var PlayerScore = this.getModel('PlayerScore');

	let result = await PlayerScore.getLeaderboard();

	this.set('players', result);

	// Render the leaderboard
	this.render('static/leaderboard');
});