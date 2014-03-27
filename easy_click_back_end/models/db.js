var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;


database = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {
	auto_reconnect: true,
	pollSize: 5,
}));

database.open(function(err, db) {
	if (!err) {
		console.log('Database ' + settings.db + ' at ' + settings.host + ' connected!');
	} else {
		console.log('Database ' + settings.db + ' at ' + settings.host + ' connect Failed!');
	}
	// db.authenticate("easyclick", "_easy_click_", function(err, res) {
	// 	console.log(res);

	// });
});

		// setInterval(function(){database.collection('posts', function(err, collection) {
		// 	collection.find().limit(1).toArray(function(err, docs){
		// 		console.log(docs[0]._id);
		// 	});
		// });},2000);

module.exports = database;