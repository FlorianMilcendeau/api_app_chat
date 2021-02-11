const express = require('express');

const router = express.Router();

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const { User: userModel, Member } = require('../models');

const genPassword = require('../utils/password');
const { generateToken } = require('../utils/JWT');

const checkToken = require('../middlewares/checkToken');
const verifyBodyLogin = require('../middlewares/verifyBodyMiddleware');

/** User register with jwt strategy. */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await userModel.findOne({ where: { email } });

    // If user exist.
    if (userFound) {
      // User already exist.
      return res
        .status(409)
        .json({ info: { success: false, message: 'Account already exist.' } });
    }

    // hash password.
    const hash = await genPassword(password);

    const newUser = await userModel.create({
      name: email.split('@')[0], // Waiting for the name field on the client side.
      password: hash,
      email,
      bio: null,
      phone: null,
      picture: null,
      roles: 'chatter',
      is_admin: false,
    });

    const { password: pwd, ...user } = newUser.dataValues;

    // If user is not create.
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Error create account',
      });
    }

    // subcription to welcom channel.
    await Member.create({
      role: 'chatter',
      user_id: user.id,
      channel_id: 1,
    });

    // subcription to Front-end developer.
    await Member.create({
      role: 'chatter',
      user_id: user.id,
      channel_id: 2,
    });

    // subcription to Back-end developer.
    await Member.create({
      role: 'chatter',
      user_id: user.id,
      channel_id: 11,
    });

    // token generated.
    const jwt = generateToken(user);

    // user was created successfully.
    return res.status(201).json({
      info: { success: true, message: 'your account was created' },
      user: { ...user },
      jwtToken: {
        token: jwt.token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.sqlMessage,
      sql: error.sql,
    });
  }
});

/** User login with jwt strategy. */
router.post('/login', verifyBodyLogin, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const userFound = await userModel.findOne({ where: { email }, raw: true });

    if (userFound == null) {
      return res.status(401).json({
        info: { success: false, message: 'Incorrect email' },
      });
    }

    const { password: hash, ...user } = userFound;

    // Password verified.
    const isValid = await bcrypt.compare(password, hash);

    // User set wrong password.
    if (!isValid) {
      return res.status(401).json({
        info: { success: false, message: 'Incorrect password' },
      });
    }

    // Token generated.
    const jwt = generateToken(user);

    // User was login successfully.
    return res.status(200).json({
      info: { success: true, message: 'You have been connected' },
      user: {
        ...user,
      },
      jwtToken: {
        token: jwt.token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.sqlMessage,
      sql: error.sql,
    });
  }
});

/** Authentication verified  */
router.get('/checkAuth', checkToken, async (req, res) => {
  const { sub: id } = req.user;

  const { password, ...user } = await userModel.findOne({
    where: { id },
    raw: true,
  });

  res.status(200).json({
    info: { success: true, message: 'You are connected' },
    user: { ...user },
  });
});

router.get('/logout', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
