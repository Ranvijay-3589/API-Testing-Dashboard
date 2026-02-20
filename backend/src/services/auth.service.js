const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const env = require('../config/env');

async function createUser({ name, email, password }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    const error = new Error('Email is already registered.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), email.toLowerCase(), passwordHash]
  );

  return result.rows[0];
}

async function loginUser({ email, password }) {
  const result = await db.query('SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1', [
    email.toLowerCase()
  ]);

  if (result.rows.length === 0) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    }
  };
}

async function getUserById(id) {
  const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

function createTokenForUser(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

module.exports = {
  createUser,
  loginUser,
  getUserById,
  createTokenForUser
};
