const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { v4 } = require('uuid');

const { User } = require('../../models/User');
const { validateAuthRequest } = require('../../middleware/validateRequest');
const { respondError, respondSuccess, generateHash, getCurrentDateTime, sanitiseUser } = require('../../common');
const { jwt } = require('../../config');


router.post('/login', validateAuthRequest, async (req, res) => {
    const { value: { username, password } } = req;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json(respondError('User does not exist'));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json(respondError('Incorrect password'));

        const token = jsonwebtoken.sign({ id: user.id }, jwt.secret, { expiresIn: 86400 });

        return res.json(respondSuccess({ token, user: sanitiseUser(user) }));
    } catch (error) {
        console.error('ERROR - /login:', error);
        return res.status(500).json(respondError('Internal server error'));
    }
});

router.post('/register', validateAuthRequest, async (req, res) => {
    const { value: { username, password } } = req;
    try {
        const users = await User.findAll({});
        const isAdmin = !users.length;
        if (!isAdmin) return res.status(401).json(respondError('There can only be one admin user'));

        const hash = await generateHash(password);

        const currentDateTime = getCurrentDateTime();

        const newUser = await User.create({
            id: v4(),
            username,
            password: hash,
            isAdmin,
            createdAt: currentDateTime,
            updatedAt: currentDateTime,
        });
        if (!newUser) return res.status(500).json(respondError('Somthing went wrong while trying to create your user'));

        const token = jsonwebtoken.sign({ id: newUser.id }, jwt.secret, { expiresIn: 86400 });

        return res.json(respondSuccess({ token, user: sanitiseUser(newUser) }));
    } catch (error) {
        console.error('ERROR - /register:', error);
        return res.status(500).json(respondError('Internal server error'));
    }
});

module.exports.authRoutes = router;
