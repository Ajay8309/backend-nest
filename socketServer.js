import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js';

export default function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: 'http://localhost:3001', credentials: true },
  });

  io.on('connection', socket => {
    console.log('User connected, socket ID:', socket.id);

    // receive userId when client connects
    socket.on('register', userId => {
      socket.userId = userId;
      socket.join(userId); // join a room with userId
    });

    // send a message
    socket.on('message:send', async ({ toUserId, text }) => {
      if (!toUserId || !text) return;

      // Save message to DB
      const msg = await Message.create({ from: socket.userId, to: toUserId, text });

      // Emit to recipient room
      io.to(toUserId).emit('message:received', {
        _id: msg._id,
        from: msg.from.toString(),
        to: msg.to.toString(),
        text: msg.text,
        createdAt: msg.createdAt,
      });

      // Optional: emit to sender as well
      socket.emit('message:received', {
        _id: msg._id,
        from: msg.from.toString(),
        to: msg.to.toString(),
        text: msg.text,
        createdAt: msg.createdAt,
      });
    });
  });

  return io;
}
