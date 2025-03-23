const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cardType: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true
    },
    cardHolder: {
        type: String,
        required: true
    },
    expiryMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    expiryYear: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt card number before saving
cardSchema.pre('save', function(next) {
    // Only show last 4 digits
    this.cardNumber = '****' + this.cardNumber.slice(-4);
    next();
});

module.exports = mongoose.model('Card', cardSchema); 