const express = require('express');
const {
    getTransactions,
    addTransaction,
    getTransaction
} = require('../controllers/transactions');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getTransactions)
    .post(addTransaction);

router
    .route('/:id')
    .get(getTransaction);

module.exports = router; 