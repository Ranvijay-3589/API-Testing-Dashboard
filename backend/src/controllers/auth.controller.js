const { validateAuthPayload } = require('../utils/validators');
const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const errors = validateAuthPayload(req.body, 'register');
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const user = await authService.createUser(req.body);
    const token = authService.createTokenForUser(user.id);

    return res.status(201).json({
      token,
      user
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validateAuthPayload(req.body, 'login');
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const data = await authService.loginUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me
};
