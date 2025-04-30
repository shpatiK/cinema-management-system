import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/auth';
import { sendActivationEmail } from '../utils/email';
import crypto from 'crypto';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const activationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      username,
      password,
      activationToken,
    });

    await sendActivationEmail(username, activationToken);
    res.status(201).json({ message: 'Activation email sent' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
       res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
       res.status(401).json({ error: 'Account not activated. Check your email.' });
    }

    const token = generateToken(user.id, user.role);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const activate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { activationToken: token } });

    if (!user) {
       res.status(400).json({ error: 'Invalid activation token' });
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Activation failed' });
  }
};
