const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    merchant: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Update user balance after transaction
transactionSchema.post('save', async function() {
    const User = this.model('User');
    const user = await User.findById(this.user);
    
    if (this.type === 'income') {
        user.totalBalance += this.amount;
    } else {
        user.totalBalance -= this.amount;
    }
    
    await user.save();
});

module.exports = mongoose.model('Transaction', transactionSchema); 