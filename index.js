const express = require('express');

const apiBook = require('./routes/book');
const apiUser = require('./routes/user');
const error404 = require('./middleware/err-404')

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json());
app.use('/public', express.static(__dirname + '/public'))
app.use('/api/user', apiUser)
app.use('/api', apiBook)
app.use(error404)

app.listen(PORT);