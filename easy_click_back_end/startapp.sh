#! /bin/sh
NODE_ENV=production
DAEMON="node cluster.js"
NAME=Easy_Click
DESC=Easy_Click
PIDFILE="easyclick.pid"

case "$1" in
	start)
		echo "Starting $DESC: "
		nohup $DAEMON > logs/info.log 2> logs/error.log &
		echo $! > $PIDFILE
		;;
	stop)
		echo "Stopping $DESC: "
		pid=`cat $PIDFILE`
		kill $pid
		rm $PIDFILE
		;;
esac
exit 0