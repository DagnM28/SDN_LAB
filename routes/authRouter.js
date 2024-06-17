const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

const authenticateRouter = express.Router();
authenticateRouter.use(bodyParser.json());

authenticateRouter.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user && user.password === req.body.password) {
                req.session.user = user;
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        })
        .catch((err) => next(err));
});

authenticateRouter.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.status(200).json({ message: 'You are logged out!' });
    } else {
        res.status(403).json({ message: 'You are not logged in!' });
    }
});

module.exports = authenticateRouter;
