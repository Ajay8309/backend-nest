import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import http from 'http';
import initSocket from './socketServer.js';


dotenv.config();
connectDB();


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


// initialize socket.io server
initSocket(server);


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));