const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Define the serverless function
module.exports = (req, res) => {
    const server = http.createServer(app);
    const io = socketio(server);

    io.on('connection', (socket) => {
        socket.on('send-location', (data) => {
            io.emit('receive-location', { id: socket.id, ...data });
        });

        socket.on('disconnect', () => {
            io.emit('user-disconnect', socket.id);
        });
    });

    app.get('/', (req, res) => {
        res.render('index');
    });

    // Handle requests
    server.emit('request', req, res);
};
