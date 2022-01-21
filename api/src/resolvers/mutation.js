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

  updateProfile: async (_, { 
      field, 
      stringValue,
      stringsValue,
      accountTypesValue,
      roleValue,
      rolesValue,
      statusValue,
      jobTypesValue,
      experienceValue,
      booleanValue
    }, { models, user }) => {

    // Takes two parameters
    // `field`: select a key from `field_to_type` to update
    // Second parameter is `field_to_type[field]`
    // Set second parameter's value based on type
    // For example, if second parameter is `stringValue`, value
    // can be set to "James"

    // HIGHLY inelegant. There has to be a better way to do this.

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    field_to_type = {
      "firstName": stringValue,
      "lastName": stringValue,
      "ens": stringValue,
      "bio": stringValue,
      "accountType": accountTypesValue,
      "currentRole": roleValue,
      "openToRoles": rolesValue,
      "website": stringValue,
      "linkedIn": stringValue,
      "github": stringValue,
      "twitter": stringValue,
      "skills": stringsValue,
      "status": statusValue,
      "jobType": jobTypesValue,
      "lookingForWebThree": stringValue,
      "experience": experienceValue,
      "isFounder": booleanValue
    }

    if (!(field in field_to_type)) {
      throw new ForbiddenError('Invalid field');
    }

    return await models.User.findOneAndUpdate(
      { id: user.id },
      { $set: { [field]: field_to_type[field] } },
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

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    field_to_type = {
      "company": stringValue,
      "title": stringValue,
      "description": stringValue,
      "startDate": dateValue,
      "endDate": dateValue,
      "positionType": jobExperienceTypeValue
    }

    if (!(field in field_to_type)) {
      throw new ForbiddenError('Invalid field');
    }

    return await models.JobExperience.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: field_to_type[field]} },
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

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }
    
    field_to_type = {
      "college": stringValue,
      "major": stringValue,
      "graduation": dateValue,
      "degreeType": degreeTypeValue,
      "gpa": floatValue,
      "gpaMax": floatValue
    }

    if (!(field in field_to_type)) {
      throw new ForbiddenError('Invalid field');
    }

    return await models.Education.findOneAndUpdate(
      { id: _id },
      { $set: {[field]: field_to_type[field]} },
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
}