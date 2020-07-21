exports.schema = `

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    categories TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP

);
CREATE TABLE IF NOT EXISTS profiles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userEmail TEXT NOT NULL UNIQUE,
    bio TEXT NOT NULL,
    FOREIGN KEY (userEmail) REFERENCES users(email) ON DELETE CASCADE
);
`;
