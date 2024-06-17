const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Dish = require('../models/dish');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dish.find({})
            .then((dishes) => {
                res.status(200).json(dishes);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.create(req.body)
            .then((dish) => {
                res.status(201).json(dish);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'PUT operation not supported on /dishes' });
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.deleteMany({})
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .then((dish) => {
                res.status(200).json(dish);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.status(403).json({ message: 'POST operation not supported on /dishes/:dishId' });
    })
    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.status(200).json(dish);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findByIdAndRemove(req.params.dishId)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.status(200).json(dish.comments);
                } else {
                    res.status(404).json({ message: 'Dish not found' });
                }
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.status(201).json(dish.comments);
                        })
                        .catch((err) => next(err));
                } else {
                    res.status(404).json({ message: 'Dish not found' });
                }
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.status(403).json({ message: 'PUT operation not supported on /dishes/:dishId/comments' });
    })
    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (let i = dish.comments.length - 1; i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.status(200).json(dish);
                        })
                        .catch((err) => next(err));
                } else {
                    res.status(404).json({ message: 'Dish not found' });
                }
            })
            .catch((err) => next(err));
    });

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dish.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.status(200).json(dish.comments.id(req.params.commentId));
                } else if (dish == null) {
                    res.status(404).json({ message: 'Dish not found' });
                } else {
                    res.status(404).json({ message: 'Comment not found' });
                }
            })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.status(403).json({ message: 'POST operation not supported on /dishes/:dishId/comments/:commentId' });
    })
    .put(authenticate.verifyOrdinaryUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
                        if (req.body.comment) {
                            dish.comments.id(req.params.commentId).comment = req.body.comment;
                        }
                        dish.save()
                            .then((dish) => {
                                res.status(200).json(dish.comments.id(req.params.commentId));
                            })
                            .catch((err) => next(err));
                    } else {
                        res.status(403).json({ message: 'You are not authorized to edit this comment' });
                    }
                } else if (dish == null) {
                    res.status(404).json({ message: 'Dish not found' });
                } else {
                    res.status(404).json({ message: 'Comment not found' });
                }
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser, (req, res, next) => {
        Dish.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    // Check if the user is the author of the comment or an admin
                    if (dish.comments.id(req.params.commentId).author.equals(req.user._id) || req.user.admin) {
                        dish.comments.pull(req.params.commentId);
                        dish.save()
                            .then((dish) => {
                                res.status(200).json(dish);
                            })
                            .catch((err) => next(err));
                    } else {
                        res.status(403).json({ message: 'You are not authorized to delete this comment' });
                    }
                } else if (dish == null) {
                    res.status(404).json({ message: 'Dish not found' });
                } else {
                    res.status(404).json({ message: 'Comment not found' });
                }
            })
            .catch((err) => next(err));
    });

module.exports = dishRouter;
