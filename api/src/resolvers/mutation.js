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

  updateUserProfile: async (_, { 
      field, 
      stringValue,
      stringsValue,
      roleValue,
      rolesValue,
      statusValue,
      jobTypesValue
    }, { models, user }) => {

    // Parameters
    // `field`: select a value from `valid_field_values` to update
    // Choose second parameter based on `field`'s type
    // For example, if `field` is "firstname" (type String), second parameter
    // must be `stringValue`
    // second parameter: set value based on type
    // For example, if second parameter is `stringValue`, you can set
    // value to "James"

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    valid_field_values = [
      "firstName",
      "lastName",
      "ens",
      "bio",
      "currentRole",
      "openToRoles",
      "website",
      "linkedIn",
      "github",
      "twitter",
      "skills",
      "status",
      "jobType",
      "lookingForWebThree",
      "experience"
    ]

    if (!valid_field_values.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    value = stringValue || stringsValue || roleValue ||
     rolesValue || statusValue || jobTypesValue || experienceValue

    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: {[field]: value} },
      { new: true }
    )
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

  updateJobExperience: async (_, { 
    _id, 
    field,
    stringValue,
    dateValue, 
    jobExperienceTypeValue }, { models, user }) => {

    valid_input_fields = [
      "company",
      "title",
      "description",
      "startDate",
      "endDate",
      "positionType"
    ]

    value = stringValue || dateValue || jobExperienceTypeValue

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

  updateEducation: async (_, { 
    _id, 
    field, 
    stringValue,
    floatValue,
    degreeTypeValue,
    dateValue }, 
  { models, user }) => {

    valid_input_fields = [
      "college",
      "major",
      "graduation",
      "degreeType",
      "gpa",
      "gpaMax"
    ]

    if (!valid_input_fields.includes(field)) {
      throw new ForbiddenError('Invalid field');
    }

    value = stringValue || floatValue || degreeTypeValue ||
     dateValue

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: value} },
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