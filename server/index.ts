import express, { Express, Request, Response } from 'express'
import { API } from './api'
import http from 'http'
import { resolve, dirname } from 'path'
import { Database } from './database'
import { Authentication } from './authentication'
import * as dotenv from 'dotenv'

// load the environment variables from the .env file
dotenv.config()

// define the token secret
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'supersecret123'

// define the backend class
class Backend {
  // Properties
  private _app: Express
  private _api: API
  private _database: Database
  private _auth: Authentication
  private _env: string
  // Getters
  public get app(): Express {
    return this._app
  }
  public get api(): API {
    return this._api
  }
  public get database(): Database {
    return this._database
  }
  public get auth(): Authentication {
    return this._auth
  }
  // Constructor
  constructor() {
    this._app = express()
    // support parsing of application/json type post data
    this._app.use(express.json())
    //support parsing of application/x-www-form-urlencoded post data
    this._app.use(express.urlencoded({ extended: true }))
    this._database = new Database()
    const auth = new Authentication(TOKEN_SECRET, this._app)
    this._api = new API(this._app, auth)
    this._env = process.env.NODE_ENV || 'development'

    // Methods
    // used for serving static files and starting the server
    this.setupStaticFiles()
    this.setupRoutes()
    this.startServer()
  }

  // used for serving static files
  // Source: https://stackoverflow.com/questions/25463423/serving-static-files-in-express-js
  private setupStaticFiles(): void {
    // serve static files from the client directory
    this._app.use(express.static('client'))
  }
  // used for setting up the routes for the server
  private setupRoutes(): void {
    // serve the index.html file for all other requests
    this._app.get('/', (req: Request, res: Response) => {
      // resolve the path to the index.html file and send it
      const __dirname = resolve(dirname(''))
      // send the index.html file to the client
      res.sendFile(__dirname + '/client/index.html')
    })
  }
  // used for starting the server
  private startServer(): void {
    // start the server on port 3000 in development mode and on port 80 in production mode because of the reverse proxy
    if (this._env === 'production') {
      http.createServer(this.app).listen(3000, () => {
        console.log('Server is listening!')
      })
    }
  }
}

// export the backend class
export const backend = new Backend()
export const viteNodeApp = backend.app
