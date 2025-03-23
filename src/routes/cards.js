const express = require('express');
const {
    getCards,
    addCard,
    deleteCard
} = require('../controllers/cards');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getCards)
    .post(addCard);

router
    .route('/:id')
    .delete(deleteCard);

module.exports = router; 