import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { register, login } from './auth';
import db from './db';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = register(username, password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(400).json({ success: false, message: 'Username already exists' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const token = login(username, password);
  if (token) {
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', ({ content, userId }) => {
    const stmt = db.prepare('INSERT INTO messages (sender_id, content) VALUES (?, ?)');
    stmt.run(userId, content);
    
    io.emit('message', {
      sender_id: userId,
      content,
      created_at: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});