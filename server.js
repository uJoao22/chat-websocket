const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

// Criando array para armazenar as mensagens enviadas
let messages = [];

// Toda vez que um novo cliente se conectar, vai ser executado essa função;
io.on('connection', socket => {
  console.log(`Socket conectado: ${socket.id}`);

  // Enviando as mensagens anteriores para qualquer novo socket que for conectado a aplicação
  socket.emit('previousMessages', messages);

  // Criando função sendMessage, para poder ser chamada no front-end
  // Criando a função utilizando a função on, que recebe uma função como parametro
  socket.on('sendMessage', data => {
    // Inserindo a mensagem no array
    messages.push(data);

    // Enviando a mensagem para todos os sockets conectados, chamando o ouvinte "receivedMessage"
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000);


// Socket.emit() - Envia mensagem para o servidor
// oscket.on() - Cria um ouvinte de evento
// socket.brodcast.emit() - Envia mensagem para todos os sockets conectados na aplicação