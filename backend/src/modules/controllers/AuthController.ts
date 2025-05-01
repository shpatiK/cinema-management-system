import User from '../models/User';
import { generateToken } from '../utils/auth';
import { sendActivationEmail } from '../utils/email';
import crypto from 'crypto';
import { Request, Response } from 'express';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authenticated requests
 *     ActivationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Activation email sent"
 */

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

/**
 * Handles user login
 * @throws {401} Invalid credentials or inactive account
 * @throws {500} Server error
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    if (!user.isActive) {
       res.status(401).json({ error: 'Account not activated. Check your email.' });
       return;
    }

    const token = generateToken(user.id, user.role);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Handles account activation
 * @throws {400} Invalid activation token
 * @throws {500} Activation failed
 */
export const activate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { activationToken: token } });

    if (!user) {
       res.status(400).json({ error: 'Invalid activation token' });
       return;
    }

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Activation failed' });
  }
};