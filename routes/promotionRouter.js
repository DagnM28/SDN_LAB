// routes/promotionRouter.js
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Promotion = require('../models/promotion');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then((promotions) => {
                res.status(200).json(promotions);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                res.status(201).json(promotion);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'PUT operation not supported on /promotions' });
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.deleteMany({})
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

promotionRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then((promotion) => {
                res.status(200).json(promotion);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'POST operation not supported on /promotions/:promoId' });
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
            .then((promotion) => {
                res.status(200).json(promotion);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

module.exports = promotionRouter;
