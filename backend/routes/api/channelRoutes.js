const router = require('express').Router();

const { authCheck } = require('../../middleware/authCheck');
const { connectionCheck } = require('../../middleware/connectionCheck');

router.get('/', authCheck, connectionCheck, async (req, res) => {

});

module.exports = router;
