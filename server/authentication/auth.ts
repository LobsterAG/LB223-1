import { Request, Response, Express } from 'express'
import * as bcrypt from 'bcrypt'
import pkg from 'jsonwebtoken'
import { backend } from '../index'
const { sign, verify } = pkg

// define the token interface
interface Token {
    userId: number
    iat: number
    exp: number
}
// extend the express request interface to include the token 
declare global {
    namespace Express {
        export interface Request {
            token?: Token
        }
    }
}
// define the authentication class
export class Authentication {
    // Properties
    app: Express
    private secretKey: string
    constructor(secretKey: string, app: Express) {
        this.secretKey = secretKey
        this.app = app
        this.app.post('/login', this.createToken.bind(this))
        this.app.post('/signup', this.createUser.bind(this))
    }

    //Create a JWT Token for the user
    // called when user logs in 
    public async createToken(request: Request, res: Response) {
        const { username, password } = request.body
        // start a transaction
        const conn = await backend.database.startTransaction()
        // get users from database and check if the user exists
        try {
            // get users from database and check if the user exists
            const users = await backend.database.executeSQL(`SELECT * FROM users WHERE username = '${username}'`, conn)
            // check again if the sql query returned a user
            const user = users.find((users) => users.username === username)
            // if the user does not exist, return an error
            if (!user) return res.status(401).json({ message: 'Invalid username' })
            // check if the user is banned
            if (user.ban === 1) return res.status(401).json({ message: 'You are banned' })
            // check if the password is valid
            const validPassword = await bcrypt.compare(password, user.password)
            // if the password is not valid, return an error
            if (!validPassword) return res.status(401).json({ message: 'Invalid username or password' })
            // create a token
            const token = sign({ username: username }, this.secretKey, { expiresIn: '1h' })
            // set the token in a cookie and send the response 
            res.cookie('authorization', token, { httpOnly: true, maxAge: 3600000 });
            // commit the transaction
            await backend.database.commitTransaction(conn)
            res.json({ message: 'Logged in successfully' });
        } catch (err) {
            // rollback the transaction if there was an error
            await backend.database.rollbackTransaction(conn)
            throw err
        }
    }
    // hash method
    // used for hashing the password
    // a static methond as it does not need to be instantiated
    public static async hashPassword(password: string) {
        // generate a salt and hash on separate function calls 
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    // verify method
    // used for verifying the token
    public verifyToken(token: string) {
        // verify the token and return the payload
        return verify(token, this.secretKey)
    }
    // signup method
    // used for signing up the user
    public async createUser(request: Request, res: Response) {
        // get the username and password from the request body
        const { username, password } = request.body
        // start a transaction
        const conn = await backend.database.startTransaction()
        // get users from database and check if the user exists
        try {
            const users = await backend.database.executeSQL(`SELECT * FROM users WHERE username = '${username}'`, conn)
            // check again if the sql query returned a user
            const user = users.find((users) => users.username === username)
            // if the user exists, return an error
            if (user) return res.status(401).json({ message: 'User already exists' })
            // hash the password
            const hashedPassword = await Authentication.hashPassword(password)
            // insert the user into the database
            await backend.database.executeSQL(`INSERT INTO users (username, password, role_id, ban) VALUES ('${username}', '${hashedPassword}', 1, 0)`, conn)
            // commit the transaction
            await backend.database.commitTransaction(conn)
            // send the response
            res.json({ message: 'User created successfully' })
        } catch (err) {
            // rollback the transaction if there was an error
            await backend.database.rollbackTransaction(conn)
            throw err
        }
    }
    // authenticate method
    // used for authenticating the user
    public authenticate(req: Request, res: Response, next: any) {
        // get the authorization header
        const cookie = req.cookies.authorization
        if (!cookie) {
            return res.status(401).json({ message: 'Missing Authorization header' })
        }
        const token = cookie.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' })
        }
        try {
            const decoded = verify(token, this.secretKey) as Token
            if (!isString(decoded)) {
                req.token = decoded
            }
            next()
        } catch (err) {
            res.status(401).json({ message: 'Invalid token' })
        }
    }
}
// isString method
// used for type checking the token
const isString = (value: any): value is string => typeof value === 'string';