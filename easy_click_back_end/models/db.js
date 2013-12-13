var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

exports.openDatabase = function openDatabase(callback) {
	database = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {
		auto_reconnect: true
	}));
	database.open(function(err, db) {
		if (err) {
			callback(err, null);
		}
		console.log('Database ' + settings.db + ' at ' + settings.host + ' connected!');
		callback(null, db);
	});
}