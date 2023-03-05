const express = require('express')
const router = express.Router()

const stor = {
    user: { 
        id: 1, 
        mail: "test@mail.ru" 
    }
};

router.get('/login', (req, res) => {
    const {user} = stor
    res.json({user})
})

module.exports = router
