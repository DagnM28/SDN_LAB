// routes/leaderRouter.js
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const leader = require('../models/leader');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        leader.find({})
            .then((leaders) => {
                res.status(200).json(leaders);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        leader.create(req.body)
            .then((leader) => {
                res.status(201).json(leader);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'PUT operation not supported on /leaders' });
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        leader.deleteMany({})
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

leaderRouter.route('/:promoId')
    .get((req, res, next) => {
        leader.findById(req.params.promoId)
            .then((leader) => {
                res.status(200).json(leader);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'POST operation not supported on /leaders/:promoId' });
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        leader.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
            .then((leader) => {
                res.status(200).json(leader);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        leader.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

module.exports = leaderRouter;
