import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"]
    }
});

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

// User management
let users = [];
let activeConversations = new Map(); // Track active conversations

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
    return users.find((user) => user.userId === receiverId);
};

// Message management
class MessageStore {
    constructor() {
        this.messages = new Map(); // conversationId -> messages[]
    }

    addMessage(conversationId, message) {
        if (!this.messages.has(conversationId)) {
            this.messages.set(conversationId, []);
        }
        const messages = this.messages.get(conversationId);
        messages.push({
            ...message,
            id: Date.now().toString(), // Simple message ID generation
            createdAt: new Date(),
            seen: false
        });
        return messages[messages.length - 1];
    }

    markMessageAsSeen(conversationId, messageId, userId) {
        const messages = this.messages.get(conversationId);
        if (messages) {
            const message = messages.find(m => m.id === messageId);
            if (message && message.receiverId === userId) {
                message.seen = true;
                return message;
            }
        }
        return null;
    }

    getUnseenMessages(conversationId, userId) {
        const messages = this.messages.get(conversationId) || [];
        return messages.filter(m => m.receiverId === userId && !m.seen);
    }
}

const messageStore = new MessageStore();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User connection handling
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
        
        // Send any unseen messages to the user
        activeConversations.forEach((conversationId) => {
            const unseenMessages = messageStore.getUnseenMessages(conversationId, userId);
            if (unseenMessages.length > 0) {
                unseenMessages.forEach(message => {
                    socket.emit("getMessage", {
                        ...message,
                        conversationId
                    });
                });
            }
        });
    });

    // Message handling
    socket.on("sendMessage", ({ senderId, receiverId, text, images, conversationId }) => {
        const message = messageStore.addMessage(conversationId, {
            senderId,
            receiverId,
            text,
            images,
            conversationId
        });

        activeConversations.set(conversationId, true);

        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                ...message,
                conversationId
            });
        }
    });

    // Message seen functionality
    socket.on("messageSeen", ({ senderId, receiverId, messageId, conversationId }) => {
        const updatedMessage = messageStore.markMessageAsSeen(conversationId, messageId, receiverId);
        if (updatedMessage) {
            const user = getUser(senderId);
            if (user) {
                io.to(user.socketId).emit("messageSeen", {
                    messageId,
                    conversationId,
                    seenAt: new Date()
                });
            }
        }
    });

    // Last message update handling
    socket.on("updateLastMessage", ({ lastMessage, lastMessageId, conversationId }) => {
        io.emit("updateLastMessage", {
            lastMessage,
            lastMessageId,
            conversationId
        });
    });

    // Typing indicator
    socket.on("typing", ({ conversationId, userId }) => {
        socket.broadcast.emit("userTyping", { conversationId, userId });
    });

    socket.on("stopTyping", ({ conversationId, userId }) => {
        socket.broadcast.emit("userStopTyping", { conversationId, userId });
    });

    // Disconnect handling
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

httpServer.listen(4000, () => {
    console.log('Server is running on port 4000');
});