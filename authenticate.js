const User = require('./models/user');

function verifyOrdinaryUser(req, res, next) {
    if (req.session && req.session.user) {
        User.findById(req.session.user._id)
            .then((user) => {
                if (user) {
                    req.user = user;
                    next();
                } else {
                    res.status(401).json({ message: 'User not found' });
                }
            })
            .catch((err) => next(err));
    } else {
        res.status(401).json({ message: 'You are not logged in!' });
    }
}

function verifyAdmin(req, res, next) {
    if (req.user && req.user.admin) {
        next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
}

module.exports = {
    verifyOrdinaryUser,
    verifyAdmin
};
