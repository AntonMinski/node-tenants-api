const Schema = require('../models/user.schema');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedResult = jwt.verify(token, process.env.JWT_SECRET);
            const user = await Schema.findOne({_id: decodedResult.id});
            const userInfo = `${user.name} / ${user.email}`;
            req.userInfo = userInfo;
        }
        next();
    } catch (error) {
        console.log('error:', error);
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};