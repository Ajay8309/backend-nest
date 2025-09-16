// controllers/profileController.js
const { createProfile } = require('../services/profileService');
const { uploadBuffer, destroy } = require('../services/cloudinaryService');
const responses = require('../utils/responses');

async function createProfileHandler(req, res) {
  try {
    console.log("ajay inside");
    // user must be authenticated
    const userId = req.user._id;
    const body = req.body || {};
    console.log(body);

    // parse possible JSON in fields (if multipart/form-data)
    // resume/cover files handled separately
    const profileData = { ...body };

    // if files uploaded
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        const r = await uploadBuffer(req.files.resume[0], 'jobnest/resumes');
        profileData.resume = { url: r.secure_url, publicId: r.public_id };
      }
      if (req.files.coverLetter && req.files.coverLetter[0]) {
        const c = await uploadBuffer(req.files.coverLetter[0], 'jobnest/coverletters');
        profileData.coverLetter = { url: c.secure_url, publicId: c.public_id };
      }
    }

    // preferences and personalityAssessment might be stringified JSON from client
    if (profileData.preferences && typeof profileData.preferences === 'string') {
      try { profileData.preferences = JSON.parse(profileData.preferences); } catch(e){}
    }
    if (profileData.personalityAssessment && typeof profileData.personalityAssessment === 'string') {
      try { profileData.personalityAssessment = JSON.parse(profileData.personalityAssessment); } catch(e){}
    }
    // skills may be comma separated
    if (profileData.skills && typeof profileData.skills === 'string') {
      profileData.skills = profileData.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    const profile = await createProfile(userId, profileData);
    return responses.success(res, 201, { message: 'Profile created successfully', profile });
  } catch (err) {
    console.log("hello inside");
    console.error(err);
    const status = err.status || 400;
    return responses.error(res, status, { error: err.message || 'invalid request body' });
  }
}

module.exports = { createProfileHandler };
