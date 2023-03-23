const io = (io) => {
  io.on('connection', (socket) => {
    socket.on('client-newnote', async (data) => {
      io.emit('server-newnote', 'new map');
    });

    socket.on('client-deletenote', async (noteId) => {
      io.emit('server-deletenote', 'delete map');
    });

    socket.on('client-getnote', async (noteId) => {
      io.emit('server-getnote', 'get map');
    });

    socket.on('client-updatenote', async (updatedNote) => {
      io.emit('server-updatenote', 'update map');
    });

    socket.on('disconnect', () => {
      console.log(socket.id, 'disconnected');
    });
  });
};

module.exports = io;
