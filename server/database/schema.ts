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

const INSERT = `
INSERT IGNORE INTO roles (role_id, role_name) VALUES
(1, 'User'),
(2, 'Moderator');
(3, 'Admin');
INSERT IGNORE INTO users (user_id, username, password, role_id) VALUES
(1, 'user1', '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e', 1),
(2, 'moderator', 'cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe', 2),
(3, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 3);
`;

export { USER_TABLE, TWEET_TABLE, LIKES_TABLE, DISLIKES_TABLE, COMMENT_TABLE, ROLE_TABLE, INSERT }

