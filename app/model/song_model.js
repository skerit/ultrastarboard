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
