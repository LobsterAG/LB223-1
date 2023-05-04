import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { USER_TABLE, TWEET_TABLE, LIKES_TABLE, DISLIKES_TABLE, COMMENT_TABLE, ROLE_TABLE, INSERT } from './schema'

export class Database {
  // Properties
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
  // Methods
  // used to initialize the database schema 
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    const conn = await this.startTransaction()
    await this.executeSQL(USER_TABLE, conn)
    await this.executeSQL(TWEET_TABLE, conn)
    await this.executeSQL(LIKES_TABLE, conn)
    await this.executeSQL(DISLIKES_TABLE, conn)
    await this.executeSQL(COMMENT_TABLE, conn)
    await this.executeSQL(ROLE_TABLE, conn)
    await this.executeSQL(INSERT, conn)
    this.commitTransaction(conn)
    console.log('DB schema initialized')
  }
  // used to start a transaction and return a connection from the pool
  // Promise is used because of asynch and waits for it to be returned before usage
  public startTransaction = async (): Promise<mariadb.PoolConnection | null> => {
    try {
      // get a connection from the pool and start a transaction 
      const conn = await this._pool.getConnection()
      await conn.beginTransaction()
      return conn
    } catch (err) {
      console.log(err)
      return null
    }
  }
  // used for queries that do not return data (INSERT, UPDATE, DELETE) and execute successfully 
  public commitTransaction = async (conn: any) => {
    // commit the transaction and close the connection
    try {
      await conn.commit()
      conn.end()
    } catch (err) {
      console.log(err)
    }
  }
  // used for queries that do not return data (INSERT, UPDATE, DELETE) and fail to execute
  public rollbackTransaction = async (conn: any) => {
    // rollback the transaction and close the connection
    try {
      await conn.rollback()
      conn.end()
    } catch (err) {
      console.log(err)
    }
  }
  // used for queries that return data (SELECT) and execute successfully 
  public executeSQL = async (query: string, conn: any): Promise<Array<any>> => {
    try {
      if (!conn) return []
      const res = await conn.query(query)
      console.log(query)
      conn.end()
      return res
    } catch (err) {
      console.log(err)
      return []
    }
  }
}