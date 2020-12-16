const router = require('express').Router();
const { v4 } = require('uuid');

const { FloatplaneCredential } = require('../../models/FloatplaneCredential');
const { authCheck } = require('../../middleware/authCheck');
const { validateFloatplaneLoginRequest, validateFloatplaneTokenRequest } = require('../../middleware/validateRequest');
const { getCurrentTimestamp, respondSuccess, respondError } = require('../../common');
const { login, token2fa } = require('../../floatplaneApi');

const url = 'https://www.floatplane.com/api';

router.post('/floatplane/login', authCheck, validateFloatplaneLoginRequest, async (req, res) => {
  try {
    const { username, password } = req.value;
    const payload = await login(username, password);
    if (!payload) return res.status(401).json(respondError('Username or password was incorrect for floatplane'));
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

router.post('/floatplane/2fa', authCheck, validateFloatplaneTokenRequest, async (req, res) => {
  const { token } = req.value;
  try {
    // Check if the user has a cookie2fa
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId: req.user.id } });
    if (!floatplaneCredential || !floatplaneCredential.cookie2fa) return res.status(404).json(respondError('You have not attempted to connect your floatplane login'));
    if (floatplaneCredential.cookie) return res.status(401).json(respondError('Already logged in'));  
  
    const payload = await token2fa(token, floatplaneCredential.cookie2fa);
    if (!payload) return res.status(401).json(respondError('Token was incorrect for floatplane'));
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
    const currentDateTime = getCurrentTimestamp();
    return FloatplaneCredential.create({
      id: v4(),
      userId,
      createdAt: currentDateTime,
    });
  } catch (error) {
    console.error('ERROR - getOrCreateFloatplaneCredential():', error);
    throw error;
  }
}

module.exports = router;
