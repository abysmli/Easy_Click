var cluster = require('cluster');
var os = require('os');

var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
	cluster.on('death',function (worker) {
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});
	for (var i = 0; i<numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
} else {
	var app = require('./app');
	app.listen(80);
}

process.on('SIGTERM', function() {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
});