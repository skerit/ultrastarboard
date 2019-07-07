/**
 * The Ultrastar Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}    options
 */
var Usdx = Function.inherits('Alchemy.Model.Sql', function Usdx(options) {
	Usdx.super.call(this, options);
});

/**
 * This is a wrapper class
 */
Usdx.makeAbstractClass();

/**
 * Use the usdx datasource
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Usdx.setProperty('dbConfig', 'usdx');

/**
 * Load fields from database? (No)
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Usdx.setProperty('load_external_schema', false);

/**
 * Disable sorting
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Usdx.setProperty('sort', null);