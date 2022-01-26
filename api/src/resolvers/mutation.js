require('dotenv').config()
const { finished } = require('stream/promises');
const bcrypt = require('bcryptjs');
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
  signUp: async (_, { email, password, firstName, lastName }, { models }) => {
    email = email.trim().toLowerCase();
    const user = await models.User.findOne( { email } );
    if (user) {
      throw new Error('User already exists');
    }
    const hashed = await bcrypt.hash(password, 10);

    try {
      const user = await models.User.create({
        email,
        firstName,
        lastName,
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
    const user = await models.User.findOne( { email } );
    if (!user) {
      throw new AuthenticationError('Email not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Invalid password');
    }
    return {
      user: user,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    };
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
      { _id: user.id },
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
    id, 
    field,
    stringValue,
    dateValue, 
    jobExperienceTypeValue }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const jobExperience = await models.JobExperience.findById(id);
    if (jobExperience && String(jobExperience.user) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update job experience!"
        );
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
      { _id: id },
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
    id, 
    field, 
    stringValue,
    floatValue,
    degreeTypeValue,
    dateValue }, 
  { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const education = await models.Education.findById(id);
    if (education && String(education.user) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update education!"
        );
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
      { _id: id },
      { $set: {[field]: field_to_type[field]} },
      { new: true }
    )
  },

  createCompany: async (_, args, { models, user }) => {
    // Add logo
    // Add founders
    // Add job postings
    const _user = await models.User.findById(user.id)
    if (!user || !_user.accountType.includes('Recruiter')) {
      throw new AuthenticationError(
        'You must be signed in as a recruiter to create a profile'
        );
    }

    return await models.Company.create({
      name: args.name,
      type: args.type,
      website: args.website,
      linkedIn: args.linkedIn,
      github: args.github,
      twitter: args.twitter,
      markets: args.markets,
      elevatorPitch: args.elevatorPitch,
      whyYourCompany: args.whyYourCompany,
      recruiters: mongoose.Types.ObjectId(user.id)
    })
  },

  updateCompany: async (_, { 
    id, 
    field,
    stringValue,
    stringsValue,
    companyTypeValue }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const company = await models.Company.findById(id);
    if (company && !company.recruiters.includes(user.id)) {
      throw new ForbiddenError(
        "You don't have permissions to update company profile!"
        );
    }

    field_to_type = {
      "name": stringValue,
      "type": companyTypeValue,
      "website": stringValue,
      "linkedIn": stringValue,
      "github": stringValue,
      "twitter": stringValue,
      "markets": stringsValue,
      "elevatorPitch": stringValue,
      "whyYourCompany": stringValue
    }

    if (!(field in field_to_type)) {
      throw new ForbiddenError('Invalid field');
    }

    return await models.Company.findOneAndUpdate(
      { _id: id },
      { $set: {[field]: field_to_type[field]} },
      { new: true }
    )
  },


  createJobPosting: async (_, args, { models, user }) => {
    // Add logo
    // Add founders
    // Add job postings
    const _user = await models.User.findById(user.id)
    if (!user || !_user.accountType.includes('Recruiter')) {
      throw new AuthenticationError(
        'You must be signed in as a recruiter to create a job posting'
        );
    }

    return await models.JobPosting.create({
      company: _user.company,
      about: args.about,
      experienceRequired: args.experienceRequired,
      roles: args.roles,
      jobType: args.jobType,
      skillsRequired: args.skillsRequired,
      hiringContact: mongoose.Types.ObjectId(user.id),
    })
  },

  updateJobPosting: async (_, { 
    id, 
    field,
    stringValue,
    stringsValue,
    experienceValue,
    rolesValue,
    jobTypeValue }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const jobPosting = await models.JobPosting.findById(id);
    if (jobPosting && String(jobPosting.hiringContact) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update job posting!"
        );
    }

    field_to_type = {
      "about": stringValue,
      "experienceRequired": experienceValue,
      "roles": rolesValue,
      "jobType": jobTypeValue,
      "skillsRequired": stringsValue,
    }

    if (!(field in field_to_type)) {
      throw new ForbiddenError('Invalid field');
    }

    return await models.JobPosting.findOneAndUpdate(
      { _id: id },
      { $set: {[field]: field_to_type[field]} },
      { new: true }
    )
  },

  applyToJob: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to apply to a job');
    }

    // models.User.findOneAndUpdate(
    //   { user.id },
    //   { $push: {appliedTo: mongoose.Types.ObjectId(id)} },
    //   { new: true }
    // )

    return await models.JobPosting.findOneAndUpdate(
      { _id: id},
      { $push: {applied: mongoose.Types.ObjectId(user.id)} },
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