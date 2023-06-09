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
    // define the routes
    this.app.post('/signup', this.auth.createUser.bind(this.auth))
    this.app.post('/login', this.auth.createToken.bind(this.auth))
    this.app.get('/hello', this.sayHello)
    // tweets
    this.app.get('/tweets', this.getAllTweets)
    this.app.get('/tweet/:id', this.getTweet)
    this.app.post('/tweet', this.createTweet)
    this.app.put('/tweet/:id', this.updateTweet)
    this.app.delete('/tweet/:id', this.deleteTweet)
    // comments
    this.app.post('/comment', this.createComment)
    this.app.put('/comment/:id', this.updateComment)
    this.app.delete('/comment/:id', this.deleteComment)
    // likes & dislikes
    this.app.post('/like', this.likeTweet)
    this.app.post('/dislike', this.dislikeTweet)
    // users
    this.app.post('/banUser/:id', this.banUser)
  }
  // Methods
  private sayHello(request: Request, res: Response) {
    // simply return a string to the client
    res.send('Hello There!')
  }

  private async getAllTweets(request: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    try {
      const response = await backend.database.executeSQL('SELECT * FROM tweets', conn)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async getTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const tweet_id = req.params.id
    try {
      const response = await backend.database.executeSQL('SELECT * FROM tweets WHERE tweet_id = "' + tweet_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json(response)
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async createTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const tweet = req.body
    try {
      const response = await backend.database.executeSQL('INSERT INTO tweets (user_id, content) VALUES ("' + tweet.user_id + '", "' + tweet.content + '")', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Created New Tweet' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async updateTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const tweet_id = req.params.id
    const tweet = req.body
    try {
      const response = await backend.database.executeSQL('UPDATE tweets SET content = "' + tweet.content + '" WHERE tweet_id = "' + tweet_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Updated the Tweet' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async deleteTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const tweet_id = req.params.id
    try {
      const response = await backend.database.executeSQL('DELETE FROM tweets WHERE tweet_id = "' + tweet_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Deleted the Tweet' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async createComment(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const comment = req.body
    try {
      const response = await backend.database.executeSQL('INSERT INTO comments (tweet_id, content, user_id) VALUES ("' + comment.tweet_id + '", "' + comment.content + '", "' + comment.user_id + '")', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Created New Comment' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async updateComment(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const comment_id = req.params.id
    const comment = req.body
    try {
      const response = await backend.database.executeSQL('UPDATE comments SET content = "' + comment.content + '" WHERE comment_id = "' + comment_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Updated the Comment' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async deleteComment(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const comment_id = req.params.id
    try {
      const response = await backend.database.executeSQL('DELETE FROM comments WHERE comment_id = "' + comment_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Deleted the Comment' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async likeTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const like = req.body
    try {
      const response = await backend.database.executeSQL('INSERT INTO likes (user_id, tweet_id) VALUES ("' + like.user_id + '", "' + like.tweet_id + '")', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Liked a Tweet' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async dislikeTweet(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const dislike = req.body
    try {
      const response = await backend.database.executeSQL('DELETE FROM likes WHERE tweet_id = "' + dislike.tweet_id + '" AND user_id = "' + dislike.user_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Disliked a Tweet' })
    }
    catch (error) {
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  private async banUser(req: Request, res: Response) {
    const conn = await backend.database.startTransaction()
    const user_id = req.params.id
    try {
      const response = await backend.database.executeSQL('UPDATE users SET ban = 1 WHERE user_id = "' + user_id + '"', conn)
      await backend.database.commitTransaction(conn)
      return res.status(200).json({ message: 'Banned the User' })
    }
    catch (error) {
      console.log(error)
      await backend.database.commitTransaction(conn)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}