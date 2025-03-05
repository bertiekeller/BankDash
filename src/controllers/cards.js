const Card = require('../models/Card');

// @desc    Get all cards
// @route   GET /api/v1/cards
// @access  Private
exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: cards.length,
            data: cards
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Add card
// @route   POST /api/v1/cards
// @access  Private
exports.addCard = async (req, res) => {
    try {
        req.body.user = req.user.id;
        
        const card = await Card.create(req.body);

        res.status(201).json({
            success: true,
            data: card
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Delete card
// @route   DELETE /api/v1/cards/:id
// @access  Private
exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!card) {
            return res.status(404).json({
                success: false,
                error: 'Card not found'
            });
        }

        await card.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}; 