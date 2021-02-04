const express = require('express');
const multer = require('multer');

const router = express.Router();
const { multerFilter, filenameMulter } = require('../config/multer');

// init multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: filenameMulter,
});
const upload = multer({ storage, fileFilter: multerFilter });

const checkToken = require('../middlewares/checkToken');
const verifyUser = require('../middlewares/verifyUser');
const { User: userModel } = require('../models/index');
const genPassword = require('../utils/password');

/** GET user by id */
router.get('/:id', async (req, res) => {
  const { id } = req.body.params;

  try {
    const User = await userModel.findByPk(id);

    const { password, ...currentUser } = User.dataValues;

    res.status(200).json({ infoLog: { success: true }, infoUser: currentUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

/** UPDATE user by id */
router.put(
  '/:id',
  checkToken,
  verifyUser,
  upload.single('picture'),
  async (req, res) => {
    const user = JSON.parse(req.body.info);
    const id = req.params;

    /** I Extract only the completed fields */
    const updateUser = Object.fromEntries(
      Object.entries(user)
        .map(([key, value]) => {
          if (value.length > 0) {
            return [key, value];
          }
        })
        .filter((property) => typeof property !== 'undefined')
    );

    try {
      // if the password has changed, I generate new hash.
      if (updateUser?.password) {
        const { password } = updateUser;
        const hash = await genPassword(password);

        updateUser.password = hash;
      }

      // Check if a picture has been sent.
      if (req?.file) {
        updateUser.picture = `${process.env.SERVER_URL}/${req.file.path}`;
      }

      // If no fields have been completed.
      if (!Object.keys(updateUser).length) {
        return res.status(406).json({
          info: { success: false, message: 'No fields have been completed' },
        });
      }

      // Update User
      await userModel.update(
        { ...updateUser },
        {
          where: id,
        }
      );

      const updatedUser = await userModel.findByPk(id.id);

      const { password, ...currentUser } = updatedUser;

      return res
        .status(200)
        .json({ info: { success: true }, user: { ...currentUser } });
    } catch (error) {
      res.status(500).json(error);
      throw new Error(error);
    }
  }
);

module.exports = router;
