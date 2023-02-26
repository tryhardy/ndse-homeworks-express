const express = require('express');
const { v4: uuid } = require('uuid');

class Book {
    constructor(title, description, authors, favorite, fileCover, fileName, id = uuid()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

const stor = {
    books: [
        new Book(
            'Название 1',
            'Самая лучшая книжка в мире',
            'Василий Пупкин',
        ),
        new Book(
            'Название 2',
            'Так себе книжонка',
            'Джо Аберкромби',
        ),
    ],
    user: { 
        id: 1, 
        mail: "test@mail.ru" 
    }
};

const app = express();
app.use(express.json());

app.post('/api/user/login', (req, res) => {
    const {user} = stor
    res.status(201)
    res.json(user)
})

app.get('/api/books', (req, res) => {
    const {books} = stor
    res.json(books)
})

app.get('/api/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } 
    else {
        res.status(404)
        res.json('Code: 404')
    }
})

app.post('/api/books/', (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName)
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

app.put('/api/books/:id', (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description, 
            authors, 
            favorite, 
            fileCover, 
            fileName
        }

        res.json(books[idx])
    } 
    else {
        res.status(404)
        res.json('Code: 404')
    }
})

app.delete('/api/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1) {
        books.splice(idx, 1)
        res.json(true)
    } 
    else {
        res.status(404)
        res.json('Code: 404')
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT);