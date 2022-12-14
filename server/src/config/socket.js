import http from 'node:http';
import { Server } from 'socket.io';

export default function socketConfig(app) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (roomName) => {
      if (socket.room) return;

      socket.room = roomName;
      socket.join(roomName);

      console.log(`Socket with id ${socket.id} joined room ${roomName}`);
    });

    socket.on('leave-room', () => {
      console.log(`Socket with id ${socket.id} left room ${socket.room}`);
      socket.leave(socket.room);
      delete socket.room;
    });

    socket.on('send-file', (file) => {
      socket.broadcast.to(socket.room).emit('receive-file', file);
      console.log(
        `Socket with id ${socket.id} sended a file to room ${socket.room}`
      );
    });

    socket.on('delete-file', (id) => {
      console.log(
        `Socket with id ${socket.id} deleted a file from room ${socket.room}`
      );
      socket.broadcast.to(socket.room).emit('delete-file', id);
    });

    socket.on('delete-all-files', () => {
      console.log(
        `Socket with id ${socket.id} deleted all files from room ${socket.room}`
      );
      socket.broadcast.to(socket.room).emit('delete-all-files');
    });
  });

  return server;
}
