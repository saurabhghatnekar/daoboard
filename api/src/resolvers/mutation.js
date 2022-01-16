require('dotenv').config()
const { finished } = require('stream/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');

// Fix singleUpload!

module.exports = {
  signUp: async (_, { email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await models.User.create({
        email,
        password: hashed
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Error creating account');
    }
  },
  
  signIn: async (_, { email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const user = await models.User.findOne({ email: email });
    
    if (!user) {
      throw new AuthenticationError('Email not found');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid password');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },

  singleUpload: async (_, { file }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;

    // Invoking the `createReadStream` will return a Readable Stream.
    // See https://nodejs.org/api/stream.html#stream_readable_streams
    const stream = createReadStream();

    // This is purely for demonstration purposes and will overwrite the
    // local-file-output.txt in the current working directory on EACH upload.
    const out = require('fs').createWriteStream('local-file-output.txt');
    stream.pipe(out);
    await finished(out);

    return { filename, mimetype, encoding };
  },
  };