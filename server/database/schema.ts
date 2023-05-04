// Objective: Create the database schema
// The schema is the structure of the database.

const ROLE_TABLE = `
CREATE TABLE IF NOT EXISTS roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255),
    PRIMARY KEY (role_id)
);
`

const USER_TABLE = `
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    ban BOOLEAN NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`

const TWEET_TABLE = `
CREATE TABLE IF NOT EXISTS tweets (
    tweet_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`

const LIKES_TABLE = `
CREATE TABLE IF NOT EXISTS likes (
    like_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    PRIMARY KEY (like_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`

const DISLIKES_TABLE = `
CREATE TABLE IF NOT EXISTS dislikes (
    dislike_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    PRIMARY KEY (dislike_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`

const COMMENT_TABLE = `
CREATE TABLE IF NOT EXISTS comments (
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`

const INSERT_ROLE_USER = `
INSERT INTO roles (role_name) VALUES ("User");
`

const INSERT_ROLE_MODERATOR = `
INSERT INTO roles (role_name) VALUES ("Moderator");
`

const INSERT_ROLE_ADMIN = `
INSERT INTO roles (role_name) VALUES ("Admin");
`

const checkIfRoleExistsAndInsertDefaults = async (conn: any) => {
    try {
        const selectQuery = `SELECT * FROM roles`
        const roles = await conn.execute(selectQuery)
        if (roles.length === 0) {
            try {
                await conn.execute(INSERT_ROLE_USER)
                await conn.execute(INSERT_ROLE_MODERATOR)
                await conn.execute(INSERT_ROLE_ADMIN)
            } catch (err) {
                console.log(err)
            }
        }
        else {
            console.log("Roles already exists");
        }
    } catch (error) {
        console.error(`Error checking if roles exist and inserting defaults: ${error}`);
    }
}

const INSERT_USER = `
INSERT INTO users (username, password, role_id, ban) VALUES ("admin", "", 3, false);
`

const INSERT_MODERATOR = `
INSERT INTO users (username, password, role_id, ban) VALUES ("moderator", "", 2, false);
`

const INSERT_ADMIN = `
INSERT INTO users (username, password, role_id, ban) VALUES ("user", "", 1, false);
`

const checkIfUserExistsAndInsertDefaults = async (conn: any) => {
    try {
        const selectQuery = `SELECT * FROM users`
        const users = await conn.execute(selectQuery)
        if (users.length === 0) {
            await conn.execute(INSERT_USER);
            await conn.execute(INSERT_MODERATOR);
            await conn.execute(INSERT_ADMIN);
        }
        else {
            console.log("Users already exists");
        }
    } catch (error) {
        console.error(`Error checking if roles exist and inserting defaults: ${error}`);
    }
}

export { ROLE_TABLE, USER_TABLE, TWEET_TABLE, LIKES_TABLE, DISLIKES_TABLE, COMMENT_TABLE, checkIfRoleExistsAndInsertDefaults, checkIfUserExistsAndInsertDefaults }