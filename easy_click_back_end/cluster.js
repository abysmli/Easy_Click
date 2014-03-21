var cluster = require('cluster');
var os = require('os');

var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
	console.log('Master start...');
	for (var i = 0; i<numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
	cluster.on('listening', function (worker, address){
		console.log('listening: Worker '+worker.process.pid+', Address: '+address.address+':'+address.port);
	});
	cluster.on('exit', function (worker, code, signal){
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
		console.log('Exit: Worker '+worker.process.pid+' died, signal: '+signal+', code: '+code);
	});
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