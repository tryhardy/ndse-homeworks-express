const express = require('express')
const { v4: uuid } = require('uuid')
const router = express.Router();
const fileMulter = require('../middleware/file')
const fs = require('fs')
const path = require('path')

class Book {
    constructor(title, description, authors, favorite, fileCover, fileName, fileBook, id = uuid()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const stor = {
    books: [
        new Book(
            'Золотые костры',
            'Суровую зиму предвещают ледяные ветра с гор. Она придёт с метелью и холодом, скрывая в снежной круговерти смерть. Где-то там, за вьюгой, мимо уснувших лесов, опустевших полей и заброшенных погостов, идёт по ночным трактам тёмный кузнец. Никто не знает, кто он, как выглядит и чего хочет. Людвиг ван Нормайенн со спутниками Проповедником и Пугалом спешат по его остывающему следу.',
            'Алексей Пехов',
        ),
        new Book(
            'Проклятый горн',
            'Горячий ветер стремительно рвется с юга, прогоняя суровую зиму и принося на крыльях черную смерть. Загадочный темный кузнец разжег в своем горне пламя судного дня, зловещие тени собираются в школе стражей, и не за горами время могил.',
            'Алексей Пехов',
        ),
    ]
};

/**
 * Получить список всех книг
 */
router.get('/', (req, res) => {
    const {books} = stor

    res.render("book/index", {
        title: "Книги",
        items: books,
    });
})

/**
 * Форма добавления новой книги
 */
router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Добавить новую книгу",
        book: {},
    });
});

/**
 * Сохранить новую книгу
 */
router.post(
    '/create', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    let fileBook = ''

    if(req.file){
        const {path} = req.file
        fileBook = path;
    }

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.status(201)
    res.render("book/success", {
        title: "Ура!",
        message: "Книга успешно добавлена. <a href='/books/" + newBook.id + "'>Просмотреть</a>",
    });
})

/**
 * Изменить книгу
 */
router.get('/update/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("book/update", {
        title: "Изменить книгу - " + books[idx]['title'],
        book: books[idx],
    });
})

router.post('/update/:id', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    let fileBook = null

    if(req.file){
        const {path} = req.file
        fileBook = path;
    }

    if (idx === -1) {
        res.redirect('/404');
    } 

    books[idx] = {
        ...books[idx],
        title,
        description, 
        authors, 
        favorite, 
        fileCover, 
        fileName,
        fileBook
    }

    res.status(201)
    res.render("book/success", {
        title: "Ура!",
        message: "Книга успешно обновлена. <a href='/books/" + books[idx].id + "'>Просмотреть</a>",
    });
})

/**
 * Удалить книгу
 */
router.post('/delete/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1) {
        books.splice(idx, 1)
        
        res.status(201)
        res.render("book/success", {
            title: "Ура!",
            message: "Книга успешно удалена. <a href='/books/'>Вернуться к списку</a>",
        });
    }
    else {
        res.redirect('/404');
    }
})

/**
 * Получить книгу по id
 */
router.get('/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("book/view", {
        title: books[idx]['title'],
        book: books[idx],
    });
})

/**
 * Скачать книгу по id
 */
router.get('/:id/download', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if(idx !== -1) {
        const filePath = path.join(__dirname, '', '..')
        const file = filePath + "\\" + books[idx]['fileBook'];
        res.download(file);
    } 
    else {
        res.redirect('/404');
    }
})

module.exports = router