import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response, Express } from 'express'
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Database } from '../database'
import bodyParser from 'body-parser';

const db = new Database();
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export class API {
  // Properties
  app: Express
  // Constructor
  constructor(app: Express) {
    this.app = app
    //Middleware
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    //Endpoints
    this.app.post('/login', this.login.bind(this));
    this.app.post('/signup', this.signup.bind(this));
    this.app.get('/whoami', this.whoAmI.bind(this));
  }
  // Methods
  // Login: used to log in an existing user
  private async login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        res.status(400).send('Please provide both a username and a password.');
        return;
      }
      // Check if the username exists in the database
      const result = await db.executeSQL('SELECT * FROM users WHERE username = ?', [username]);
      if (result.length === 0) {
        res.status(400).send('The username or password is incorrect.');
        return;
      }
      // Check if the password is correct
      const user = result[0];
      const hashedPassword = crypto.scryptSync(password, user.salt, 64).toString('hex');
      if (user.password !== hashedPassword) {
        res.status(400).send('The username or password is incorrect.');
        return;
      }
      // Generate an access token
      const accessToken = jwt.sign({ username: user.username }, TOKEN_SECRET);
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.status(200).send('Login successful.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to log in.');
    }
  }
  // SignUp: used to register a new user
  private async signup(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        res.status(400).send('Please provide both a username and a password.');
        return;
      }
      // Check if the username already exists in the database
      const result = await db.executeSQL('SELECT username FROM users WHERE username = ?', [username]);
      if (result.length > 0) {
        res.status(400).send('This username already exists. Please choose a different one.');
        return;
      }
      // Hash the password
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
      // Store the user in the database
      await db.executeSQL('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)', [username, hashedPassword, salt]);
      res.status(200).send('Sign-up successful.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to sign up.');
    }
  }
  // Who Am I: used to get the username of the user that is currently logged in
  private async whoAmI(req: Request, res: Response) {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) {
        res.status(400).send('No access token provided.');
        return;
      }
      const decoded = jwt.verify(accessToken, TOKEN_SECRET) as { username: string };
      const username = decoded.username;
      res.status(200).json({ username });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to get username.');
    }
  }
}