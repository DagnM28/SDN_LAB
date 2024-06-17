const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter');
const promotionRouter = require('./routes/promotionRouter');
const leaderRouter = require('./routes/leaderRouter');

const app = express();
const port = 8080;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/LAB3', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
