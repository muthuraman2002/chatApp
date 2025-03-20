import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

export interface User {
  id: number;
  username: string;
}

export const register = (username: string, password: string): User | null => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?) RETURNING id, username')
      .get(username, hashedPassword) as User;
    return result;
  } catch (error) {
    return null;
  }
};

export const login = (username: string, password: string): string | null => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  }
  
  return null;
};