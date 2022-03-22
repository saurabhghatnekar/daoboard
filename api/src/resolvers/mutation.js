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
// Add logo to createCompany

module.exports = {
  signUp: async (_, { email, password, firstName, lastName, role }, { models }) => {
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
        role,
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

  updateProfile: async (_, params, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const shouldUpdateFirstName = params.firstName != null;
    const shouldUpdateLastName = params.lastName != null;
    const shouldUpdatePublicKey = params.publicKey != null;
    const shouldUpdateENS = params.ens != null;
    const shouldUpdateAccountType = params.accountType;
    const shouldUpdateCurrentRole = params.currentRole != null;
    const shouldUpdateOpenToRoles = params.openToRoles;
    const shouldUpdateBio = params.bio != null;
    const shouldUpdateWebsite = params.website != null;
    const shouldUpdateLinkedIn = params.linkedIn != null;
    const shouldUpdateGithub = params.github != null;
    const shouldUpdateTwitter = params.twitter != null;
    const shouldUpdateStatus = params.status != null;
    const shouldUpdateHereTo = params.hereTo
    const shouldUpdateLookingForWebThree = params.lookingForWebThree != null;

    var user = models.User.findById(user.id);

      if (shouldUpdateFirstName) {
          user.update(
            { $set: { firstName: params.firstName } }
          )
      }

      if (shouldUpdateLastName) {
        user.update(
          { $set: { lastName: params.lastName } }
        )
      }

      if (shouldUpdatePublicKey) {
        user.update(
          { $set: { publicKey: params.publicKey } }
        )
      }

      if (shouldUpdateENS) {
        user.update(
          { $set: { ens: params.ens } }
        )
      }

      if (shouldUpdateAccountType) {
        user.update(
          { $set: { accountType: params.accountType } }
        )
      }

      if (shouldUpdateCurrentRole) {
        user.update(
          { $set: { currentRole: params.currentRole } }
        )
      }

      if (shouldUpdateOpenToRoles) {
        user.update(
          { $set: { openToRoles: params.openToRoles } }
        )
      }

      if (shouldUpdateBio) {
        user.update(
          { $set: { bio: params.bio } }
        )
      }

      if (shouldUpdateWebsite) {
        user.update(
          { $set: { website: params.website } }
        )
      }

      if (shouldUpdateLinkedIn) {
        user.update(
          { $set: { linkedIn: params.linkedIn } }
        )
      }

      if (shouldUpdateGithub) {
        user.update(
          { $set: { github: params.github } }
        )
      }

      if (shouldUpdateTwitter) {
        user.update(
          { $set: { twitter: params.twitter } }
        )
      }

      if (shouldUpdateStatus) {
        user.update(
          { $set: { status: params.status } }
        )
      }

      if (shouldUpdateHereTo) {
        user.update(
          { $set: { hereTo: params.hereTo } }
        )
      }

      if (shouldUpdateLookingForWebThree) {
        user.update(
          { $set: { lookingForWebThree: params.lookingForWebThree } }
        )
      }


    return await models.users.findById(users.id);
  },

  updatePFP: async (_, { pfp }, { models, user }) => {
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
      user: mongoose.Types.ObjectId(user.id)
    })
  },

  updateJobExperience: async (_, params, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const jobExperience = models.JobExperience.findById(params.id);

    if (jobExperience && String(jobExperience.user) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update job experience!"
        );
    }

    const shouldUpdateCompany = params.company != null;
    const shouldUpdateTitle = params.title != null;
    const shouldUpdateStartDate = params.startDate != null;
    const shouldUpdateEndDate = params.endDate != null;

    if (shouldUpdateCompany) {
      jobExperience.update(
        { $set: { company: params.company } }
      )
    }

    if (shouldUpdateTitle) {
      jobExperience.update(
        { $set: { title: params.title } }
      )
    }

    if (shouldUpdateStartDate) {
      jobExperience.update(
        { $set: { startDate: params.startDate } }
      )
    }

    if (shouldUpdateEndDate) {
      jobExperience.update(
        { $set: { endDate: params.endDate } }
      )
    }

    return await models.JobExperience.findById(params.id);
  },


  createEducation: async (_, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError(
        'You must be signed in to create a profile');
    }

    return await models.Education.create({
      school: args.school,
      graduation: args.graduation,
      degreeType: args.degreeType,
      user: mongoose.Types.ObjectId(user.id)
    })
  },

  updateEducation: async (_, params, { models, user }) => {

    if (!user) {
      throw new AuthenticationError(
        'You must be signed in to create a profile');
    }

    const education = await models.Education.findById(params.id);

    if (education && String(education.user) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update education!"
        );
    }
    
    const shouldUpdateSchool = params.school != null;
    const shouldUpdateGraduation = params.graduation != null;
    const shouldUpdateStartDegreeType = params.degreeType != null;

    if (shouldUpdateSchool) {
      education.update(
        { $set: { school: params.school } }
      )
    }

    if (shouldUpdateGraduation) {
      education.update(
        { $set: { graduation: params.graduation } }
      )
    }

    if (shouldUpdateStartDegreeType) {
      education.update(
        { $set: { degreeType: params.degreeType } }
      )
    }

    return await models.Education.findById(params.id);
  },

  createCompany: async (_, args, { models, user }) => {
    // Add logo
    const _user = await models.User.findById(user.id)
    if (!user || !_user.accountType.includes('Recruiter')) {
      throw new AuthenticationError(
        'You must be signed in as a recruiter to create a company profile'
        );
    }

    const company = await models.Company.create({
      name: args.name,
      type: args.type,
      website: args.website,
      linkedIn: args.linkedIn,
      github: args.github,
      twitter: args.twitter,
      markets: args.markets,
      elevatorPitch: args.elevatorPitch,
      recruiters: mongoose.Types.ObjectId(user.id)
    })

    await models.User.findOneAndUpdate(
      { _id: user.id },
      { company: mongoose.Types.ObjectId(company) }
    );

    return company;
  },

  updateCompany: async (_, params, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const company = await models.Company.findById(params.id);
    if (company && !company.recruiters.includes(user.id)) {
      throw new ForbiddenError(
        "You don't have permissions to update company profile!"
        );
    }

    const shouldUpdateName = params.name != null;
    const shouldUpdateType = params.type != null;
    const shouldUpdateWebsite = params.website != null;
    const shouldUpdateLinkedIn = params.linkedIn != null;
    const shouldUpdateGithub = params.github != null;
    const shouldUpdateTwitter = params.twitter != null;
    const shouldUpdateMarkets = params.markets;
    const shouldUpdateElevatorPitch = params.elevatorPitch != null;

    if (shouldUpdateName) {
      company.update(
        { $set: { name: params.name } }
      )
    }

    if (shouldUpdateType) {
      company.update(
        { $set: { type: params.type } }
      )
    }

    if (shouldUpdateWebsite) {
      company.update(
        { $set: { website: params.website } }
      )
    }

    if (shouldUpdateLinkedIn) {
      company.update(
        { $set: { linkedIn: params.linkedIn } }
      )
    }

    if (shouldUpdateGithub) {
      company.update(
        { $set: { github: params.github } }
      )
    }

    if (shouldUpdateTwitter) {
      company.update(
        { $set: { twitter: params.twitter } }
      )
    }

    if (shouldUpdateMarkets) {
      company.update(
        { $set: { markets: params.markets } }
      )
    }

    if (shouldUpdateElevatorPitch) {
      company.update(
        { $set: { elevatorPitch: params.elevatorPitch } }
      )
    }

    return await models.Company.findById(params.id);
  },


  createJobPosting: async (_, args, { models, user }) => {
    const _user = await models.User.findById(user.id)
    if (!user || !_user.accountType.includes('Recruiter')) {
      throw new AuthenticationError(
        'You must be signed in as a recruiter to create a job posting'
        );
    }

    return await models.JobPosting.create({
      company: _user.company,
      title: args.title,
      about: args.about,
      roles: args.roles,
      jobType: args.jobType,
      recruiter: mongoose.Types.ObjectId(user.id),
    })
  },

  updateJobPosting: async (_, params, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to create a profile');
    }

    const jobPosting = await models.JobPosting.findById(id);
    if (jobPosting && String(jobPosting.hiringContact) !== user.id) {
      throw new ForbiddenError(
        "You don't have permissions to update job posting!"
        );
    }

    const shouldUpdateTitle = params.title != null;
    const shouldUpdateAbout = params.about != null;
    const shouldUpdateRoles = params.roles;
    const shouldUpdateJobType = params.jobType != null;

    if (shouldUpdateTitle) {
      company.update(
        { $set: { title: params.title } }
      )
    }

    if (shouldUpdateAbout) {
      company.update(
        { $set: { about: params.about } }
      )
    }

    if (shouldUpdateRoles) {
      company.update(
        { $set: { roles: params.roles } }
      )
    }

    if (shouldUpdateJobType) {
      company.update(
        { $set: { jobType: params.jobType } }
      )
    }

    return await models.JobPosting.findById(id);
  },

  matchToJobPosting: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to match');
    }

    const jobPosting = await models.JobPosting.findById(id);
    const recruiter = jobPosting.recruiter;

    models.User.findOneAndUpdate(
       { recruiter },
       { $push: {matchedFrom: mongoose.Types.ObjectId(user.id)} },
     )

     if (recruiter.matchedTo.includes(user.id)) {
       models.User.findOneAndUpdate(
         { user },
         { $push: {matches: mongoose.Types.ObjectId(recruiter.id)} },
       ),
       models.User.findOneAndUpdate(
        { recruiter },
        { $push: {matches: mongoose.Types.ObjectId(user.id)} },
      )
     }

    return await models.User.findOneAndUpdate(
      { user },
      { $push: {matchedTo: mongoose.Types.ObjectId(recruiter.id)} },
      { new: true }
    )
  },

  matchToJobSeeker: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to match');
    }

    const jobSeeker = await models.User.findById(id);

    models.User.findOneAndUpdate(
       { jobSeeker },
       { $push: {matchedFrom: mongoose.Types.ObjectId(user.id)} },
     )

     if (jobSeeker.matchedTo.includes(user.id)) {
      models.User.findOneAndUpdate(
        { user },
        { $push: {matches: mongoose.Types.ObjectId(jobSeeker.id)} },
      ),
      models.User.findOneAndUpdate(
       { jobSeeker },
       { $push: {matches: mongoose.Types.ObjectId(user.id)} },
     )
    }

    return await models.User.findOneAndUpdate(
      { user },
      { $push: {matchedTo: mongoose.Types.ObjectId(jobSeeker.id)} },
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

  applyToJobPosting: async (_, {jobPostingId, userId}, { models, user }) => {

    if (!user) {
      throw new AuthenticationError('You must be signed in to apply to a job');
    }
    console.log(jobPostingId)
    let jobPosting = await models.JobPosting.findById(jobPostingId);
    console.log(jobPosting)
    jobPosting = await models.JobPosting.findOneAndUpdate(
      { _id: jobPostingId},
      { $push: {applied: mongoose.Types.ObjectId(userId)} },
      { new: true }
    )
    console.log(jobPosting)
    return jobPosting
  },

  matchToJobPosting: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to apply to a job');
    }

    const jobPosting = await models.JobPosting.findById(id);
    if (jobPosting && !jobPosting.applied.includes(user.id)) {
      throw new ForbiddenError(
        "You don't have permissions to update job posting!"
        );
    }
    await models.user.findOneAndUpdate(
      { _id: user.id},
      { $push: {appliedTo: mongoose.Types.ObjectId(id)} },
      { new: true }
    )

    return await models.JobPosting.findOneAndUpdate(
      { _id: id },
      { $push: {matched: mongoose.Types.ObjectId(user.id)} },
      { new: true }
    )
  },

  rejectJobPosting: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to apply to a job');
    }

    const jobPosting = await models.JobPosting.findById(id);
    if (jobPosting && !jobPosting.applied.includes(user.id)) {
      throw new ForbiddenError(
        "You don't have permissions to update job posting!"
        );
    }

    await models.user.findOneAndUpdate(
      { _id: user.id},
      { $pull: {appliedTo: mongoose.Types.ObjectId(id)} },
      { new: true }
    )

    return await models.JobPosting.findOneAndUpdate(
      { _id: id },
      { $pull: {applied: mongoose.Types.ObjectId(user.id)} },
      { new: true }
    )
  },


}