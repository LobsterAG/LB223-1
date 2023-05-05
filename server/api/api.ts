// Source: https://github.com/SwitzerChees/simple-typescript-template/tree/auth
import { Request, Response, Express } from 'express'
import { Authentication } from '../authentication'
import { backend } from '../index'

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
    // posts
    this.app.get('/posts', this.getAllPosts.bind(this))
    this.app.post('/post', this.auth.authenticate.bind(this.auth), this.createPost.bind(this))
    this.app.get('/post/:tweet_id', this.getPost.bind(this))
    this.app.put('/post/:tweet_id', this.auth.authenticate.bind(this.auth), this.updatePost.bind(this))
    this.app.delete('/posts/:tweet_id', this.auth.authenticate.bind(this.auth), this.deletePost.bind(this))
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

  public async getAllPosts(res: Response) {
    const conn = await backend.database.startTransaction()
    const tweets = await backend.database.executeSQL(`SELECT * FROM tweets`, conn)
    await backend.database.commitTransaction(conn)
    res.status(200).json({ tweets })
  }

  public async createPost(request: Request, res: Response) {
    const { user_id, content } = request.body
    const conn = await backend.database.startTransaction()
    const tweet = await backend.database.executeSQL(`INSERT INTO tweets (user_id, content) VALUES (${user_id}, '${content}')`, conn)
    await backend.database.commitTransaction(conn)
    res.status(200).json({ tweet })
  }

  public async getPost(request: Request, res: Response) {
    const { tweet_id } = request.params
    const conn = await backend.database.startTransaction()
    const tweet = await backend.database.executeSQL(`SELECT * FROM tweets WHERE tweet_id = ${tweet_id}`, conn)
    await backend.database.commitTransaction(conn)
    res.status(200).json({ tweet })
  }

  public async updatePost(request: Request, res: Response) {
    const { tweet_id } = request.params
    const { content } = request.body
    const conn = await backend.database.startTransaction()
    const tweet = await backend.database.executeSQL(`UPDATE tweets SET content = '${content}' WHERE tweet_id = ${tweet_id}`, conn)
    await backend.database.commitTransaction(conn)
    res.status(200).json({ tweet })
  }

  public async deletePost(request: Request, res: Response) {
    const { tweet_id } = request.params
    const conn = await backend.database.startTransaction()
    const tweet = await backend.database.executeSQL(`DELETE FROM tweets WHERE tweet_id = ${tweet_id}`, conn)
    await backend.database.commitTransaction(conn)
    res.status(200).json({ tweet })
  }
}