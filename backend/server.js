import express from 'express';
import memesRoutes from './routes/memes.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/memes', memesRoutes(io));

io.on('connection', (socket) => {
  console.log('WebSocket connected:', socket.id);
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));