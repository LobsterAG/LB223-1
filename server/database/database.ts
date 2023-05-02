import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE, LIKES_TABLE, DISLIKES_TABLE, COMMENT_TABLE, ROLE_TABLE, INSERT } from './schema'

export class Database {
  // It is only used internally by the constructor.
  // This property is responsible for creating the database connection pool.
  // The pool is a collection of connections to the database.
  // The pool is used to execute queries.
  private _pool: Pool
  // Constructor
  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }

  // private because no expose
  // It is only used internally by the constructor.
  // This method is responsible for creating the database schema.
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    // Initialize the database schema
    try {
      await this._pool.query(USER_TABLE)
      await this._pool.query(ROLE_TABLE)
      await this._pool.query(TWEET_TABLE)
      await this._pool.query(LIKES_TABLE)
      await this._pool.query(DISLIKES_TABLE)
      await this._pool.query(COMMENT_TABLE)
      await this._pool.query(INSERT)
      console.log('DB schema initialized!')
    } catch (err) {
      console.log(err)
    }
  }

  // used by the API class.
  // This method is responsible for executing SQL queries.
  public executeSQL = async (query: string, values?: any[]) => {
    // Get a connection from the pool, execute the query, close the connection
    try {
      const conn = await this._pool.getConnection()
      const res = await conn.query(query)
      conn.end()
      return res
    } catch (err) {
      // If there is an error, log it and return undefined
      console.log(err)
    }
  }
}
