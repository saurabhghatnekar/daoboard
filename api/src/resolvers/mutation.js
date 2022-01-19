require('dotenv').config()
const { finished } = require('stream/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');

// Fix singleUpload!
// Create updatePFP and updateResume logic (probably combine)
// maxLength validator not working

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
    const user = await models.User.findOne({ email });
    
    if (!user) {
      throw new AuthenticationError('Email not found');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid password');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },



  updatePFP: async (_, { pfp }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return // Update this
  },

  updateResume: async (_, { resume }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return // Update this
  },


  updateCurrentRole: async (_, { currentRole }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {currentRole} },
      { new: true }
    )
  },

  updateExperience: async (_, { experience }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {experience} },
      { new: true }
    )
  },

  updateOpenToRoles: async (_, { openToRoles }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {openToRoles} },
      { new: true }
    )
  },

  updateUserStringField: async (_, { field, value }, { models, user }) => {
    valid_input_fields = [
      "firstName",
      "lastName",
      "ens",
      "bio",
      "website",
      "linkedIn",
      "github",
      "twitter",
      "lookingForWebThree"
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {[field]: value} },
      { new: true }
    )
  },

  updateSkills: async (_, { skills }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {skills} },
      { new: true }
    )
  },

  updateStatus: async (_, { status }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {status} },
      { new: true }
    )
  },

  updateJobType: async (_, { jobType }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {jobType} },
      { new: true }
    )
  },

  createJobExperience: async (_, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    return await models.JobExperience.create({
      company: args.company,
      title: args.title,
      startDate: args.startDate,
      endDate: args.endDate,
      description: args.description,
      positionType: args.positionType,
      user: mongoose.Types.ObjectId(user.id)
    })
  },

  updateJobExperienceStringField: async (_, { _id, field, value }, 
  { models, user }) => {
    valid_input_fields = [
      "company",
      "title",
      "description"
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.JobExperience.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: value} },
      { new: true }
    )
  },

  updateJobExperienceDateField: async (_, { _id, field, value }, 
  { models, user }) => {
    valid_input_fields = [
      "startDate",
      "endDate"
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.JobExperience.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: value} },
      { new: true }
    )
  },

  updatePositionType: async (_, { _id, positionType }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.JobExperience.findOneAndUpdate(
      { id: _id },
      { $set: {positionType} },
      { new: true }
    )
  },

  createEducation: async (_, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    return await models.Education.create({
      college: args.college,
      graduation: args.graduation,
      degreeType: args.degreeType,
      major: args.major,
      gpa: args.gpa,
      gpaMax: args.gpaMax,
      user: mongoose.Types.ObjectId(user.id)
    })
  },

  updateEducationStringField: async (_, { _id, field, value }, 
  { models, user }) => {
    valid_input_fields = [
      "college",
      "major",
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: value} },
      { new: true }
    )
  },

  updateEducationFloatField: async (_, { _id, field, value }, 
  { models, user }) => {
    valid_input_fields = [
      "gpa",
      "gpaMax"
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: value} },
      { new: true }
    )
  },

  updateGraduation: async (_, { _id, graduation }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {graduation} },
      { new: true }
    )
  },

  updateDegreeType: async (_, { _id, degreeType }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {degreeType} },
      { new: true }
    )
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