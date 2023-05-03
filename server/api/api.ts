// Source: https://github.com/SwitzerChees/simple-typescript-template/tree/auth
import { Request, Response, Express } from 'express'
import { Authentication } from '../authentication'
import { backend } from '../index'

export class API {
  // Properties
  app: Express
  auth: Authentication
  // Constructor
  constructor(app: Express, auth: Authentication) {
    this.app = app
    this.auth = auth
    this.app.post('/signup', this.signup)
    this.app.post('/login', this.auth.createToken.bind(this.auth))
    this.app.get('/hello', this.sayHello)
    this.app.get('/hello/secure', this.auth.authenticate.bind(this.auth), this.sayHelloSecure)
  }
  // Methods
  private sayHello(request: Request, res: Response) {
    res.send('Hello There!')
  }

  private sayHelloSecure(request: Request, res: Response) {
    res.status(200).json({ message: 'Hello There from Secure endpoint!' })
  }

  private async signup(request: Request, res: Response) {
    const { username, password } = request.body
    const conn = await backend.database.startTransaction()
    const users = await backend.database.executeSQL(`SELECT * FROM users WHERE username = '${username}'`, conn)
    if (users.length > 0) return res.status(401).json({ message: 'Username already exists' })
    const hashedPassword = await Authentication.hashPassword(password)
    const response = await backend.database.executeSQL('INSERT INTO users(username, password, role_name) VALUES ("' + username + '" , "' + hashedPassword + '" , "user")', conn)
    console.log("registration: " + response)
    await backend.database.commitTransaction(conn)
  }
}