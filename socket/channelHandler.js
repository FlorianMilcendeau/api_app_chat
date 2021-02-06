module.exports = (socket) => {
  // Listen if anyone joins the channel.
  socket.on('JOIN_ROOM', (room) => {
    if (!socket.rooms.has(room)) {
      socket.join(room);
    }
  });
};
