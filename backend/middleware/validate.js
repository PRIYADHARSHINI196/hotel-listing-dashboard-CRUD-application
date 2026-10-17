const { body, validationResult } = require('express-validator');

exports.hotelRules = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

exports.check = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};