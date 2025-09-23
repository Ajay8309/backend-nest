import { Server } from "socket.io";
import http from "http";
import Message from "./models/Message.js";

export default function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "http://localhost:3001", credentials: true },
    });

    // Store user socket mappings
    const userSocketMap = new Map();

    io.on("connection", (socket) => {
        console.log("User connected, socket ID:", socket.id);

        // receive userId when client connects
        socket.on("register", (userId) => {
            console.log(`User ${userId} registered with socket ${socket.id}`);
            socket.userId = userId;
            userSocketMap.set(userId, socket.id);
            socket.join(userId); // join a room with userId
        });

        // send a message
        socket.on("message:send", async ({ toUserId, text }) => {
            if (!toUserId || !text || !socket.userId) {
                console.log("Invalid message data:", {
                    toUserId,
                    text,
                    userId: socket.userId,
                });
                return;
            }

            try {
                // Save message to DB
                const msg = await Message.create({
                    from: socket.userId,
                    to: toUserId,
                    text,
                });

                console.log(
                    `Message saved: ${socket.userId} -> ${toUserId}: ${text}`
                );

                const messageData = {
                    _id: msg._id,
                    from: msg.from.toString(),
                    to: msg.to.toString(),
                    text: msg.text,
                    createdAt: msg.createdAt,
                };

                // Emit to recipient room
                io.to(toUserId).emit("message:received", messageData);
                console.log(`Message sent to user ${toUserId}`);

                // Also emit to sender for confirmation
                socket.emit("message:received", messageData);
                console.log(`Message confirmed to sender ${socket.userId}`);
            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("message:error", {
                    error: "Failed to send message",
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(
                `User ${socket.userId} disconnected, socket ID: ${socket.id}`
            );
            if (socket.userId) {
                userSocketMap.delete(socket.userId);
            }
        });
    });

    return io;
}
