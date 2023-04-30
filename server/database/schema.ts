// Objective: Create the database schema
// The schema is the structure of the database.
// Drop the tables if they exist.

const ROLE_TABLE = `
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
    role_id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(255),
    PRIMARY KEY (role_id)
);
`


const USER_TABLE = `
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);
`

const TWEET_TABLE = `
DROP TABLE IF EXISTS tweets;
CREATE TABLE IF NOT EXISTS tweets (
    tweet_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
`

const LIKES_TABLE = `
DROP TABLE IF EXISTS likes;
CREATE TABLE IF NOT EXISTS likes (
    like_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    PRIMARY KEY (like_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);
`

const DISLIKES_TABLE = `
DROP TABLE IF EXISTS dislikes;
CREATE TABLE IF NOT EXISTS dislikes (
    dislike_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    PRIMARY KEY (dislike_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);
`

const COMMENT_TABLE = `
DROP TABLE IF EXISTS comments;
CREATE TABLE IF NOT EXISTS comments (
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    tweet_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);
`

export { USER_TABLE, TWEET_TABLE, LIKES_TABLE, DISLIKES_TABLE, COMMENT_TABLE, ROLE_TABLE }
