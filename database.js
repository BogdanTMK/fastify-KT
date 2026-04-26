import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const db = new Database(path.join(__dirname, 'database.db'));


db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);


const count = db.prepare('SELECT COUNT(*) as count FROM users').get();


if (count.count === 0) {
  const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  insert.run('Маша', 'masha@mail.com');
  insert.run('Петя', 'petya@mail.com');
  console.log('Начальные данные добавлены в базу данных');
}


export const getAllUsers = () => {
  return db.prepare('SELECT * FROM users ORDER BY id').all();
};

export const getUserById = (id) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

export const createUser = (name, email) => {
  const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = insert.run(name, email);
  return result.lastInsertRowid;
};

export const updateUser = (id, name, email) => {
  const update = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
  return update.run(name, email, id);
};

export const deleteUser = (id) => {
  const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?');
  return deleteStmt.run(id);
};

export default db;

