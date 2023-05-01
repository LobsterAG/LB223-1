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
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.post('/login', this.login.bind(this));
    this.app.post('/register', this.register.bind(this));
    this.app.get('/whoami', this.whoAmI.bind(this));
    
  }
  // Methods
  // Login
  // used to log in an existing user
  private async login(req: Request, res: Response) {
    const { username, password } = req.body;
    console.log(username, password);

    try {
      if (!username) {
        res.status(400).send('Please put in your username.');
        return;
      }
      const result = await db.executeSQL('SELECT username, password FROM users WHERE username = ?', [username]);
      if (result.length > 0) {
        const user = result[0];
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password === hashedPassword) {
          const token = this.generateAccessToken({ username });
          res.cookie('jwt', token, { httpOnly: true });
          res.status(200).send('Login successful.');
        } else {
          res.status(400).send('Invalid username or password.');
        }
      } else {
        res.status(400).send('Invalid username or password.');
      }
    } catch (error) {
      res.status(500).send('Failed to login.');
    }
  }
  // Register
  // used to register a new user
  private async register(req: Request, res: Response) {
    const { username, password, role_id } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const existingUser = await db.executeSQL('SELECT username FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).send("This username already exists. Please choose a different username.");
    }
    const userRole = role_id || 1;
    try {
      await db.executeSQL(
        `INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)`,
        [username, hashedPassword, userRole]
      );
      res.send(`User ${username} registered successfully.`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to register user.');
    }
  }
  // Generate Access Token
  // used to generate a token for the user that is currently logged in
  private generateAccessToken(username: { username: string }) {
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
  }
  // Authentication
  // used to check if the user is logged in
  public authentication(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    }
    return true;
  }
  // Who Am I
  // used to get the username of the user that is currently logged in
  public whoAmI(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!this.authentication(req, res)) {
      return;
    }
    try {
      const decodedToken = jwt.verify(token, TOKEN_SECRET) as { username: string };
      const username = decodedToken.username;
      res.status(200).send(username);
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  }

}
