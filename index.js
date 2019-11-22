const express = require('express');
const mysql = require('mysql');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('new message', msg);
  });
});


const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'football_french_championship'

});

app.get('/teams', function(req, res) {
  connection.query('SELECT * FROM teams' , function (err, data) {
    res.json(data)

  })


});

app.get('/players/:teamId' , function(req, res){
  const teamId = req.params.teamId
  connection.query('SELECT * FROM players JOIN players_has_teams ON players_has_teams.id_player = players.id WHERE players_has_teams.id_team =' + teamId , function (err, data) {
    res.json(data)

  })
})

http.listen(8080,  function () {
  console.log('http://localhost:8080');
});
