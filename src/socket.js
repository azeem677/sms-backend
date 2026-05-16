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

                // --- AI AGENT LOGIC ---
                const User = require('./models/User');
                const aiUser = await User.findOne({ email: 'ai.assistant@system.com' });
                
                if (aiUser && receiver === aiUser._id.toString()) {
                    // This is a message for the AI
                    console.log('AI processing message...');
                    
                    let aiResponseContent = '';
                    const lowerContent = content.toLowerCase();

                    // Simple rule-based logic for demo
                    if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
                        aiResponseContent = "Hello! I am your AI Project Assistant. How can I help you manage your projects today?";
                    } else if (lowerContent.includes('task')) {
                        aiResponseContent = "Tasks are the building blocks of your projects. You can create them in the Project Details page.";
                    } else if (lowerContent.includes('project')) {
                        aiResponseContent = "You can manage all your projects from the Dashboard. Need help creating a new one?";
                    } else if (lowerContent.includes('who are you')) {
                        aiResponseContent = "I am an AI agent integrated into your Project Management System to help you stay organized.";
                    } else {
                        aiResponseContent = `I've received your message: "${content}". Currently, I'm in beta mode, but soon I'll be able to help you with advanced analytics and automation!`;
                    }

                    // Delay to simulate thinking
                    setTimeout(async () => {
                        const aiMessage = await Message.create({
                            sender: aiUser._id,
                            receiver: sender,
                            content: aiResponseContent
                        });

                        // Emit to user
                        io.to(sender).emit('newMessage', aiMessage);
                    }, 1500);
                }
                // --- END AI AGENT LOGIC ---
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
