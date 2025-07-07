// src/server.js
require('dotenv').config({ path: '/Users/vitou/Documents/ecommerc-backend/.env' });
const http = require('http');
const app = require('./app');
const socketIo = require('./sockets/socket');
const connectDB = require('./config/db');

connectDB();
const server = http.createServer(app);
socketIo(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));