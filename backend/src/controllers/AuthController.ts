import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/auth';

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      const token = generateToken(user.id);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}


