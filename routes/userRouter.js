const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const User = require('../models/user');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
    .get(authenticate.verifyOrdinaryUser, (req, res, next) => {
        User.find({})
            .then((users) => {
                res.status(200).json(users);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        User.create(req.body)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'PUT operation not supported on /users' });
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        User.deleteMany({})
            .then((resp) => {
                res.status(200).json(resp);
            })
            .catch((err) => next(err));
    });

userRouter.route('/:userId')
    .get(authenticate.verifyOrdinaryUser, (req, res, next) => {
        User.findById(req.params.userId)
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'POST operation not supported on /users/:userId' });
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        User.findByIdAndRemove(req.params.userId)
            .then((resp) => {
                res.status(200).json(resp);
            })
            .catch((err) => next(err));
    });

module.exports = userRouter;
