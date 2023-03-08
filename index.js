const express = require('express');

const routIndex = require('./routes/index');
const routBook = require('./routes/book');
const routUser = require('./routes/user');
const err404 = require('./middleware/404')

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/public', express.static(__dirname + '/public'))
app.use('/', routIndex)
app.use('/books', routBook)
app.use('/user', routUser)
app.use(err404)

app.listen(PORT);