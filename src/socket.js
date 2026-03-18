const socketio = require('socket.io');
const Message = require('./models/Message');

const socketHandler = (server) => {
    const io = socketio(server, {
        cors: {
            origin: "*", // Adjust this for production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('sendMessage', async (data) => {
            const { sender, receiver, content } = data;

            try {
                const message = await Message.create({
                    sender,
                    receiver,
                    content
                });

                // Emit to receiver
                io.to(receiver).emit('newMessage', message);

                // Also emit back to sender to confirm
                io.to(sender).emit('messageSent', message);
            } catch (err) {
                console.error('Error saving message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = socketHandler;
