const router = require('express').Router();
const { v4 } = require('uuid');

const { FloatplaneCredential } = require('../../models/FloatplaneCredential');
const { authCheck } = require('../../middleware/authCheck');
const { validateFloatplaneLoginRequest, validateFloatplaneTokenRequest } = require('../../middleware/validateRequest');
const { respondSuccess, respondError } = require('../../common');
const { login, token2fa, getChannels } = require('../../floatplaneApi');
const { updateFloatplaneCredential } = require('../../services/floatplaneCredential');
const { updateChannels } = require('../../services/floatplaneChannelSetting');

const url = 'https://www.floatplane.com/api';

router.post('/floatplane/login', authCheck, validateFloatplaneLoginRequest, async (req, res) => {
  try {
    const { username, password } = req.value;
    const payload = await login(username, password);
    if (!payload) return res.status(401).json(respondError('Username or password was incorrect for floatplane'));

    await updateFloatplaneCredential(req.user.id, payload);

    if (!payload.needs2FA) {
      await updateChannels(req.user.id, true);
    }

    return res.json(respondSuccess({ needs2FA: payload.needs2FA }));
  } catch (error) {
    console.error('ERROR - /floatplane/login:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

router.post('/floatplane/2fa', authCheck, validateFloatplaneTokenRequest, async (req, res) => {
  const { token } = req.value;
  try {
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId: req.user.id } });
    // Check if the user has a cookie2fa
    if (!floatplaneCredential || !floatplaneCredential.cookie2fa) return res.status(404).json(respondError('You have not attempted to connect your floatplane login'));
    // Check if the user has a cookie
    if (floatplaneCredential.cookie) return res.status(401).json(respondError('Already logged in'));  
  
    const payload = await token2fa(token, floatplaneCredential.cookie2fa);
    if (!payload) return res.status(401).json(respondError('Token was incorrect for floatplane'));

    await updateFloatplaneCredential(req.user.id, payload);

    if (!payload.needs2FA) {
      await updateChannels(req.user.id, true);
    }

    return res.json(respondSuccess({ needs2FA: payload.needs2FA }));
  } catch (error) {
    console.error('ERROR - /floatplane/token:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

module.exports = router;
