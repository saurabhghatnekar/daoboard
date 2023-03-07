require('dotenv').config()

const {finished} = require('stream/promises');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');
const {Buffer} = require('buffer');

const StreamChat = require('stream-chat').StreamChat;

const {extname} = require('path');
const {v4: uuid} = require('uuid'); // (A)
const s3 = require('./s3');
const {FirebaseAdmin} = require("../helpers/firebase/firebase.helper"); // (B)


// const firebaseConfig = {
//
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID
// }

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Fix singleUpload!
// Create updatePFP and updateResume logic (probably combine)
// maxLength validator not working


const chatServerClient = StreamChat.getInstance('njfg29ktgtqd', 'chsrjq6h6qar93py8j47k5swc6ey35k5e58npng88azxahffehukumw45r9g6ys9');


const uploadFile = async (file) => {
    const {createReadStream, filename, mimetype, encoding} = await file;

    const {Location} = await s3.upload({ // (C)
        Body: createReadStream(),
        Key: `${uuid()}${extname(filename)}`,
        ContentType: mimetype
    }).promise();

    return Location
}


module.exports = {
    signUp: async (_, {email, password, firstName, lastName, accountType, companyId, uid, pfp}, {models}) => {
        console.log("signUp", email, password, firstName, lastName, accountType, companyId, uid, pfp)
        email = email.trim().toLowerCase();
        const user = await models.User.findOne({email});
        if (user) {
            throw new Error('User already exists');
        }

        try {
            const user = await models.User.create({
                email,
                firstName,
                lastName,
                accountType,
                uid,
                pfp,
                companyId: mongoose.Types.ObjectId(companyId)

            });
            const chatServerResp = await chatServerClient.upsertUsers([{
                id: user.id,
                firstName: firstName,
                lastName: lastName
            }]);
            console.log("chatServerResp", chatServerResp);
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            throw new Error('Error creating account');
        }
    },

    signIn: async (_, {email, password}, {models}) => {

        email = email.trim().toLowerCase();
        const user = await models.User.findOne({email});

        if (!user) {
            throw new AuthenticationError('Email not found');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Invalid password');
        }
        await FirebaseAdmin.auth().updateUser(user.uid, {dbId: user.id})

        return {
            user: user,
            token: jwt.sign({id: user._id}, process.env.JWT_SECRET)
        };
    },
    generateChatToken: async (_, {chatWithId}, {models, user}) => {
        console.log("generateChatToken user", user);
        const userFound = await models.User.findById(user.id);
        if (!userFound) {
            throw new ForbiddenError('User not found');
        }
        const chatWithUser = await models.User.findById(chatWithId);
        if (!chatWithUser) {
            throw new ForbiddenError('User not found');
        }

        const token = chatServerClient.createToken(user.id);
        console.log("generateChatToken token", token);
        let chatId = ""
        console.log("accountType", userFound.accountType);
        if (userFound.accountType[0] === "JobSeeker") {
            chatId = `${user.id}-${chatWithId}`;
        } else {
            chatId = `${chatWithId}-${user.id}`;
        }
        return {
            chatId: chatId,
            chatName: chatWithUser.firstName + " " + chatWithUser.lastName,
            user: userFound,
            token: token

        };
    },

    updateProfile: async (_, {
        firstName,
        lastName,
        publicKey,
        ens,
        accountType,
        currentRole,
        openToRoles,
        bio,
        website,
        linkedIn,
        github,
        twitter,
        status,
        hereTo,
        lookingFor,
    }, {models, user}) => {

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
        console.log("user", user);
        const userToUpdate = await models.User.findById(user.id);
        console.log(userToUpdate);
        if (!userToUpdate) {
            throw new Error('User not found');
        }
        if (firstName) {
            userToUpdate.firstName = firstName;
        }
        if (lastName) {
            userToUpdate.lastName = lastName;
        }
        if (publicKey) {
            userToUpdate.publicKey = publicKey;
        }
        if (ens) {
            userToUpdate.ens = ens;
        }
        if (accountType) {
            userToUpdate.accountType = accountType;
        }
        if (currentRole) {
            userToUpdate.currentRole = currentRole;
        }
        if (openToRoles) {
            userToUpdate.openToRoles = openToRoles;
        }
        if (bio) {
            userToUpdate.bio = bio;
        }
        if (website) {
            userToUpdate.website = website;
        }
        if (linkedIn) {
            userToUpdate.linkedIn = linkedIn;
        }
        if (github) {
            userToUpdate.github = github;
        }
        if (twitter) {
            userToUpdate.twitter = twitter;
        }
        if (status) {
            userToUpdate.status = status;
        }
        if (hereTo) {
            userToUpdate.hereTo = hereTo;
        }
        if (lookingFor) {
            userToUpdate.lookingFor = lookingFor;
        }
        try {
            await userToUpdate.save();
            return userToUpdate;
        } catch (err) {
            console.log(err);
            throw new Error('Error updating profile');
        }


    },

    updatePFP: async (_, {pfp}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }
        const Location = await uploadFile(pfp);
        const {createReadStream, filename, mimetype, encoding} = await pfp;
        const stream = createReadStream();

        const userToUpdate = await models.User.findById(user.id);
        if (!userToUpdate) {
            throw new Error('User not found');
        }
        userToUpdate.pfp = Location

        try {
            await userToUpdate.save();
            return userToUpdate;
        } catch (err) {
            console.log(err);
            throw new Error('Error updating profile');
        }

    },

    updateResume: async (_, {resume}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }
        // Update this
    },


    createJobExperience: async (_, args, {models, user}) => {

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
        company,
        title,
        startDate,
        endDate
    }, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }

        const jobExperience = await models.JobExperience.findById(id);
        if (jobExperience && String(jobExperience.user) !== user.id) {
            throw new ForbiddenError(
                "You don't have permissions to update job experience!"
            );
        }

        if (!jobExperience) {
            throw new Error('Job experience not found');
        }
        if (company !== undefined) {
            jobExperience.company = company;
        }
        if (title !== undefined) {
            jobExperience.title = title;
        }
        if (startDate !== undefined) {
            jobExperience.startDate = startDate;
        }
        if (endDate !== undefined) {
            jobExperience.endDate = endDate;
        }
        await jobExperience.save();
        return jobExperience;
    },


    createEducation: async (_, args, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }
        console.log(args);
        const education = await models.Education.create({
            school: args.school,
            graduation: args.graduation,
            degreeType: args.degreeType,
            major: args.major,
            gpa: args.gpa,
            gpaMax: args.gpaMax,
            user: mongoose.Types.ObjectId(user.id)
        })

        return education
    },

    updateEducation: async (_, {
                                id,
                                school,
                                graduation,
                                degreeType,
                            },
                            {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }

        const education = await models.Education.findById(id);

        if (education && String(education.user) !== user.id) {
            throw new ForbiddenError(
                "You don't have permissions to update education!"
            );
        }

        if (school !== undefined) {
            education.school = school;
        }
        if (graduation !== undefined) {
            education.graduation = graduation;
        }
        if (degreeType !== undefined) {
            education.degreeType = degreeType;
        }
        await education.save();

        return education;
    },

    createCompany: async (_, args, {models, user}) => {
        // Add logo
        // Add founders
        // Add job postings
        const _user = await models.User.findById(user.id)
        if (!user || !_user.accountType in ['Recruiter', 'CompanyAdmin']) {
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
            whyYourCompany: args.whyYourCompany,
            recruiters: mongoose.Types.ObjectId(user.id)
        })

        await models.User.findOneAndUpdate(
            {_id: user.id},
            {companyId: mongoose.Types.ObjectId(company)}
        );

        return company;
    },

    updateCompanyLogo: async (_, {companyId, logo}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }
        const currentUser = await models.User.findById(user.id);
        const company = await models.Company.findById(companyId);
        console.log(currentUser)
        console.log(company);
        if (!company) {
            throw new Error('Company not found');
        }
        if (!currentUser.accountType.includes("CompanyAdmin") || currentUser.companyId.toString() !== company["_id"].toString()) {
            throw new ForbiddenError(
                "You don't have permissions to update company logo!"
            );
        }
        try {


            // console.log(logo);
            const Location = await uploadFile(logo);
            // const {createReadStream, filename, mimetype, encoding} = await logo;
            // const stream = createReadStream();
            console.log(Location);

            company.logo = Location
        } catch (err) {
            console.log(err);
            throw new Error('Error updating company logo');
        }
        try {
            await company.save();
            return company;
        } catch (err) {
            console.log(err);
            throw new Error('Error updating profile');
        }
    },

    updateCompany: async (_, {
        id,
        name,
        type,
        website,
        linkedIn,
        github,
        twitter,
        markets,
        elevatorPitch
    }, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }

        const company = await models.Company.findById(id);
        if (company && !company.recruiters.includes(user.id)) {
            throw new ForbiddenError(
                "You don't have permissions to update company profile!"
            );
        }

        if (name !== undefined) {
            company.name = name;
        }
        if (type !== undefined) {
            company.type = type;
        }
        if (website !== undefined) {
            company.website = website;
        }
        if (linkedIn !== undefined) {
            company.linkedIn = linkedIn;
        }
        if (github !== undefined) {
            company.github = github;
        }
        if (twitter !== undefined) {
            company.twitter = twitter;
        }
        if (markets !== undefined) {
            company.markets = markets;
        }
        if (elevatorPitch !== undefined) {
            company.elevatorPitch = elevatorPitch;
        }
        await company.save();

        return company;
    },


    createJobPosting: async (_, args, {models, user}) => {
        // Add logo
        // Add founders
        // Add job postings
        console.log(args);
        const _user = await models.User.findById(user.id)
        if (!user || !_user.accountType.includes('CompanyAdmin')) {
            throw new AuthenticationError(
                'You must be signed in as a recruiter to create a job posting'
            );
        }
        console.log(_user)
        const jobPosting = await models.JobPosting.create({
            company: _user.companyId,
            companyId: _user.companyId,
            about: args.about,
            title: args.title,
            experienceRequired: args.experienceRequired,
            roles: args.roles,
            jobType: args.jobType,
            skillsRequired: args.skillsRequired,
            hiringContact: mongoose.Types.ObjectId(user.id),
        })
        await models.Company.findOneAndUpdate(
            {_id: _user.companyId},
            {$push: {jobPostings: mongoose.Types.ObjectId(jobPosting)}}
        );
        return jobPosting

    },

    updateJobPosting: async (_, {
        id,
        title,
        about,
        role,
        jobType
    }, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to create a profile');
        }
        const jobPosting = await models.JobPosting.findById(id);
        if (String(jobPosting.hiringContact) !== user.id) {

            throw new ForbiddenError(
                "You don't have permissions to update job posting!"
            );
        }

        return await models.JobPosting.findOneAndUpdate(
            {_id: id},
            {$set: {title, about, role, jobType}},
            {new: true}
        )

    },

    applyToJob: async (_, {id}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to apply to a job');
        }

        // models.User.findOneAndUpdate(
        //   { user.id },
        //   { $push: {appliedTo: mongoose.Types.ObjectId(id)} },
        //   { new: true }
        // )

        return await models.JobPosting.findOneAndUpdate(
            {_id: id},
            {$push: {applied: mongoose.Types.ObjectId(user.id)}},
            {new: true}
        )
    },


    singleUpload: async (_, {file}, {models, user}) => {
        const Location = uploadFile(file);

        await models.User.findOneAndUpdate(
            {_id: user.id},
            {$push: {uploads: Location}},
            {new: true})

        return {
            filename,
            mimetype,
            encoding,
            uri: Location
        };
    },

    uploadResume: async (_, {file}, {models, user}) => {
        const {createReadStream, filename, mimetype, encoding} = await file;
        // const s3FileName = `${uuid()}${extname(filename)}`;
        // console.log("s3FileName", s3FileName);

        const {Location} = await s3.upload({ // (C)
            Body: createReadStream(),
            Key: `${uuid()}${extname(filename)}`,
            ContentType: mimetype
        }).promise();


        await models.User.findOneAndUpdate(
            {_id: user.id},
            {$set: {resume: Location}},
            {new: true}
        )

        return {
            filename,
            mimetype,
            encoding,
            uri: Location
        };
    },

    // applyToJobPosting: async (_, {jobPostingId, userId}, {models, user}) => {
    //
    //     if (!user) {
    //         throw new AuthenticationError('You must be signed in to apply to a job');
    //     }
    //     console.log(jobPostingId)
    //     let jobPosting = await models.JobPosting.findById(jobPostingId);
    //     console.log(jobPosting)
    //     jobPosting = await models.JobPosting.findOneAndUpdate(
    //         {_id: jobPostingId},
    //         {$push: {applied: mongoose.Types.ObjectId(userId)}},
    //         {new: true}
    //     )
    //
    //     return jobPosting
    // },

    applyToJobPosting: async (_, {jobPostingId}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to apply to a job');
        }
        // console.log("applyToJobPosting- id", jobPostingId)
        const jobPosting = await models.JobPosting.findById(jobPostingId);
        // console.log("applyToJobPosting- jobPosting", jobPosting)
        // console.log("jobPosting.applied.includes(user.id)", jobPosting.applied.includes(user.id))
        if (jobPosting && jobPosting.applied.includes(user.id)) {
            throw new ForbiddenError(
                "You have already applied to this job posting"
            );
        }
        await models.User.findOneAndUpdate(
            {_id: user.id},
            {
                $addToSet: {
                    appliedTo: mongoose.Types.ObjectId(jobPostingId),
                    recruitersOfApplied: jobPosting.hiringContact
                }
            },
            {new: true}
        )

        return await models.JobPosting.findOneAndUpdate(
            {_id: jobPostingId},
            {$push: {applied: mongoose.Types.ObjectId(user.id)}},
            {new: true}
        );
    },

    rejectJobPosting: async (_, {jobPostingId}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to apply to a job');
        }

        const jobPosting = await models.JobPosting.findById(jobPostingId);
        // if (jobPosting && !jobPosting.applied.includes(user.id)) {
        //     throw new ForbiddenError(
        //         "You don't have permissions to update job posting!"
        //     );
        // }

        await models.User.findOneAndUpdate(
            {_id: user.id},
            {
                $pull: {appliedTo: mongoose.Types.ObjectId(jobPostingId)},
                $push: {rejected: mongoose.Types.ObjectId(jobPostingId)}
            },
            {new: true}
        )

        return await models.JobPosting.findOneAndUpdate(
            {_id: jobPostingId},
            {$pull: {applied: mongoose.Types.ObjectId(user.id)}},
            {new: true}
        )
    },

    matchToJobSeeker: async (_, {jobSeekerId}, {models, user}) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to match to a jobseeker');
        }

        return await models.User.findOneAndUpdate(
            {_id: user.id},
            {$push: {shortlistedCandidates: mongoose.Types.ObjectId(jobSeekerId)}},
            {new: true}
        )

    },

    shortlistJobSeeker: async (_, {jobSeekerId}, {models, user}) => {
        console.log("shortlistJobSeeker- jobSeekerId", jobSeekerId)
        if (!user) {
            throw new AuthenticationError('You must be signed in to match to a jobseeker');
        }
        const recruiter = await models.User.findById(user.id);
        console.log("jobSeekerId", jobSeekerId)
        await models.Company.findOneAndUpdate(
            {_id: recruiter.companyId},
            {$push: {shortlistedJobSeekersList: mongoose.Types.ObjectId(jobSeekerId)}},
            {new: true}
        )


        const updatedUser = await models.User.findOneAndUpdate(
            {_id: recruiter.id},
            {
                $push: {
                    shortlistedJobSeekers: mongoose.Types.ObjectId(jobSeekerId),
                    shortlistedCandidates: mongoose.Types.ObjectId(jobSeekerId)
                }
            },

            {new: true}
        )
        let match = await models.User.findOne({_id: jobSeekerId, shortlistedCompanies: {$in: [recruiter.companyId]}})
        let isMatch = false;
        // console.log("match", match)
        if (match) {
            isMatch = true;
            // await models.Match.create({
            //     jobSeekerId: jobSeekerId,
            //     companyId: recruiter.companyId,
            // })
        }
        return {
            user: updatedUser,
            isMatch: isMatch
        }
    },

    rejectJobSeeker: async (_, {jobSeekerId}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to reject a job');
        }
        // console.log("rejectJobSeeker- id", jobSeekerId)
        return await models.User.findOneAndUpdate(
            {_id: user.id},
            {$addToSet: {rejectedJobSeeker: mongoose.Types.ObjectId(jobSeekerId)}},
            {new: true}
        )

    },

    shortlistCompany: async (_, {companyId}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to match to a company');
        }
        // console.log("shortlistCompany- id", companyId)
        const company = await models.Company.findById(companyId);
        await models.User.findOneAndUpdate(
            {_id: user.id},
            {
                $addToSet: {shortlistedCompanies: mongoose.Types.ObjectId(companyId)},
                // $pull: {rejectedCompanies: mongoose.Types.ObjectId(companyId)}
            },
            {new: true}
        )
        let match = await models.Company.findOne({_id: companyId, shortlistedJobSeekersList: {$in: [user.id]}})
        let isMatch = false;
        // console.log("match", match)
        if (match) {
            isMatch = true;
            // await models.Match.create({
            //     jobSeekerId: user.id,
            //     companyId: companyId,
            // })
        }
        return {
            company: company,
            isMatch: isMatch
        }


        // return company


    },
    rejectCompany: async (_, {companyId}, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to reject a company');
        }
        // console.log("rejectCompany- id", companyId)
        return await models.User.findOneAndUpdate(
            {_id: user.id},
            {
                $addToSet: {rejectedCompanies: mongoose.Types.ObjectId(companyId)},
                $pull: {shortlistedCompanies: mongoose.Types.ObjectId(companyId)}
            },

            {new: true}
        )
    }

}