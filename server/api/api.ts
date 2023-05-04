// Source: https://github.com/SwitzerChees/simple-typescript-template/tree/auth
import { Request, Response, Express } from 'express'
import { Authentication } from '../authentication'

// define the API class
export class API {
  // Properties
  app: Express
  auth: Authentication
  // Constructor
  constructor(app: Express, auth: Authentication) {
    this.app = app
    this.auth = auth
    this.app.post('/signup', this.auth.createUser.bind(this.auth))
    this.app.post('/login', this.auth.createToken.bind(this.auth))
    this.app.get('/hello', this.sayHello)
    this.app.get('/hello/secure', this.auth.authenticate.bind(this.auth), this.sayHelloSecure)
  }
  // Methods
  private sayHello(request: Request, res: Response) {
    // simply return a string to the client
    res.send('Hello There!')
  }

  private sayHelloSecure(request: Request, res: Response) {
    // simply return a string to the client if the user is authenticated
    res.status(200).json({ message: 'Hello There from Secure endpoint!' })
  }
}