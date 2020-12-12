const router = require('express').Router();
const fetch = require('node-fetch');
const { v4 } = require('uuid');

const { FloatplaneCredential } = require('../../models/FloatplaneCredential');
const { post } = require('../../api');
const { authCheck } = require('../../middleware/authCheck');
const { validateFloatplaneLoginRequest, validateFloatplaneTokenRequest } = require('../../middleware/validateRequest');
const { getCurrentDateTime, respondSuccess, respondSuccessMsg } = require('../../common');

const url = 'https://www.floatplane.com/api';

router.post('/floatplane/login', authCheck, validateFloatplaneLoginRequest, async (req, res) => {
  try {
    const payload = await post(`${url}/v2/auth/login`, req.value);
    const floatplaneCredential = await getOrCreateFloatplaneCredential(req.user.id, payload);
    if (payload.needs2FA) {
      await floatplaneCredential.update({
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
    return res.json(respondSuccessMsg('Successfully connected floatplane'));
  } catch (error) {
    console.error('ERROR - /floatplane/login:', error);
    return res.status(500).json(respondError('Internal server error'));
  }
});

router.post('/floatplane/2fa', authCheck, validateFloatplaneTokenRequest, (req, res) => {
  const { token } = req.value;
  console.log(token);
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
