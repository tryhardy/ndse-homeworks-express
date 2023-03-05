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
router.get('/books', (req, res) => {
    const {books} = stor
    res.json(books)
})

/**
 * Получить книгу по id
 */
router.get('/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } 
})

/**
 * Скачать книгу по id
 */
router.get('/books/:id/download', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if(idx !== -1) {
        const filePath = path.join(__dirname, '', '..')
        const file = filePath + '\\public\\books\\1677968090897-lcXJug4fIZ3bi6IcZlRAaPvaxysKkB1BH69RHr7WuxJ7vMo8HLpV9clpZMXGU4mbP2wLfJBtJhCdwQyOCIISFTW8.jpg';
        res.download(file);
    } 
})

/**
 * Добавить новую книгу
 */
router.post(
    '/books/', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    let fileBook = null
    if(req.file){
        const {path} = req.file
        fileBook = path;
    }

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

/**
 * Изменить книгу
 */
router.put('/books/:id', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    let fileBook = null

    if(req.file){
        const {path} = req.file
        fileBook = path;
    }

    if (idx !== -1) {
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

        res.json(books[idx])
    } 
})

/**
 * Удалить книгу
 */
router.delete('/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1) {
        books.splice(idx, 1)
        res.json('ok')
    } 
})

module.exports = router