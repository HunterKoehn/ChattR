const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname+'/public')));
let count = 0;

io.on('connection', function(socket){
	socket.on('newuser',function(username){
		socket.broadcast.emit('update', username + ' joined the conversation');
		count++;
		io.emit('userCount', count);
	});
	socket.on('exituser',function(username){
		// socket.broadcast.emit("update", username + ' left the conversation');
		// count--;
		io.emit('userCount', count);
	});
	socket.on('chat',function(message){
		socket.broadcast.emit('chat', message);
	});
	socket.on('disconnect', function(username){
		socket.broadcast.emit("update", 'A user has left the conversation');
		count--;
		io.emit('userCount', count);
	});
});

server.listen(5000);


