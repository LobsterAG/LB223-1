import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response, Express } from 'express'
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
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    //Endpoints
    this.app.post('/login', this.login);
    this.app.post('/signup', this.signup);
    this.app.get('/whoami', this.whoAmI);
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
      const result = await db.executeSQL('SELECT username, password FROM users WHERE username = ?', [username]);
      if (result.length === 0) {
        res.status(400).send('This username does not exist.');
        return;
      }
      // Hash the password
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      // Check if the password is correct
      if (hashedPassword !== result[0].password) {
        res.status(400).send('The password is incorrect.');
        return;
      }
      // Create an access token
      const accessToken = jwt.sign({ username }, TOKEN_SECRET);
      // Send the access token to the client inside a cookie
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
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      // Store the user in the database
      await db.executeSQL('INSERT INTO users (username, password, role_id) VALUES (?, ?, 1)', [username, hashedPassword, 1]);
      res.status(200).send('Sign-up successful.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to sign up.');
    }
  }
  // Who Am I: used to get the username of the user that is currently logged in
  private async whoAmI(req: Request, res: Response) {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        res.status(401).send('You are not logged in.');
        return;
      }
      const payload = jwt.verify(accessToken, TOKEN_SECRET) as { username: string };
      const username = payload.username;
      res.status(200).send(`You are logged in as ${username}.`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to check if you are logged in.');
    }
  }
}