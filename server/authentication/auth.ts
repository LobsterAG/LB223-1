import { Request, Response, Express } from 'express'
import * as bcrypt from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { backend } from '../index'

interface Token {
    userId: number
    iat: number
    exp: number
}
declare global {
    namespace Express {
        export interface Request {
            token?: Token
        }
    }
}

export class Authentication {
    // Properties
    app: Express
    private secretKey: string
    constructor(secretKey: string, app: Express) {
        this.secretKey = secretKey
        this.app = app
        this.app.post('/login', this.createToken.bind(this))
    }

    //Create a JWT Token for the user
    public async createToken(req: Request, res: Response) {
        const { username, password } = req.body
        // start a transaction
        const conn = await backend.database.startTransaction()
        // get users from database and check if the user exists
        const users = await backend.database.executeSQL(`SELECT * FROM users WHERE username = '${username}'`, conn)
        // check again if the sql query returned a user
        const user = users.find((users) => users.username === username)
        // if the user does not exist, return an error
        if (!user) return res.status(401).json({ message: 'Invalid username' })
        // check if the password is valid
        const validPassword = await bcrypt.compare(password, user.password)
        // if the password is not valid, return an error
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' })
        // commit the transaction
        await backend.database.commitTransaction(conn)
        const token = sign({ userId: user.id }, this.secretKey, { expiresIn: '1h' })
        res.json({ token })
    }
    // hash method
    public static async hashPassword(password: string) {
        // generate a salt and hash on separate function calls 
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
    // verify method
    public verifyToken(token: string) {
        return verify(token, this.secretKey)
    }
    // authenticate method
    public authenticate(req: Request, res: Response, next: any) {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ message: 'Missing Authorization header' })
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
const isString = (value: any): value is string => typeof value === 'string'