require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');


const app = express();
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

mongoose.connect('mongodb://localhost:27017/вшздщьфви', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .catch((err) => {
        console.log(`Ошибка подключения к бд: ${err.toString()}`);
    });


app.use(bodyParser.json());
app.post("/signup", createUser);
app.post("/signin", login);
app.use(auth);
app.use("/users", userRouter);
app.use("/articles", articlesRouter);
app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({ message });
});

app.listen(PORT);