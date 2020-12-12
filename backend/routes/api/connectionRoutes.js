const router = require('express').Router();
const fetch = require('node-fetch');
const { v4 } = require('uuid');

const { FloatplaneCredential } = require('../../models/FloatplaneCredential');
const { post } = require('../../api');
const { authCheck } = require('../../middleware/authCheck');
const { validateFloatplaneLoginRequest, validateFloatplaneTokenRequest } = require('../../middleware/validateRequest');
const { getCurrentDateTime, respondSuccess, respondError } = require('../../common');
const { default: Axios } = require('axios');

const url = 'https://www.floatplane.com/api';

router.post('/floatplane/login', authCheck, validateFloatplaneLoginRequest, async (req, res) => {
  try {
    const payload = await post(`${url}/v2/auth/login`, {}, req.value, res);
    const floatplaneCredential = await getOrCreateFloatplaneCredential(req.user.id, payload);
    if (payload.needs2FA) {
      await floatplaneCredential.update({
        floatplaneUserId: null,
        floatplaneUserImage: null,
        cookie2fa: payload.cookie,
        cookie: null,
      });
      return res.json(respondSuccess({ needs2FA: payload.needs2FA }));
    }
    await floatplaneCredential.update({
      floatplaneUserId: payload.user.id,
      floatplaneUserImage: payload.user.profileImage.path,
      cookie2fa: null,
      cookie: payload.cookie,
    });
    return res.json(respondSuccess({ needs2FA: payload.needs2FA }));
  } catch (error) {
    console.error('ERROR - /floatplane/login:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

// TODO: Remove cookie from validation 

router.post('/floatplane/2fa', authCheck, validateFloatplaneTokenRequest, async (req, res) => {
  try {
    // Check if the user has a cookie2fa
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId: req.user.id } });
    if (!floatplaneCredential || !floatplaneCredential.cookie2fa) return res.status(404).json(respondError('You have not attempted to connect your floatplane login'));
    if (floatplaneCredential.cookie) return res.status(401).json(respondError('Already logged in'));  
  
    const payload = await post(`${url}/v2/auth/checkFor2faLogin`, { 'Cookie': floatplaneCredential.cookie2fa }, req.value, res);
    if (payload.needs2FA) {
      return res.status(500).json(respondError('Something went wrong need 2fa again'));
    }

    await floatplaneCredential.update({
      floatplaneUserId: payload.user.id,
      floatplaneUserImage: payload.user.profileImage.path,
      cookie2fa: null,
      cookie: payload.cookie,
    });
    return res.json(respondSuccess({ needs2FA: payload.needs2FA }));
  } catch (error) {
    console.error('ERROR - /floatplane/token:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

const getOrCreateFloatplaneCredential = async (userId) => {
  try {
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId } });
    if (floatplaneCredential) return floatplaneCredential;
    const currentDateTime = getCurrentDateTime();
    return FloatplaneCredential.create({
      id: v4(),
      userId,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    });
  } catch (error) {
    console.error('ERROR - getOrCreateFloatplaneCredential():', error);
    throw error;
  }
}

module.exports = router;
