const { body, validationResult } = require('express-validator');

const validateContactForm = [
  body('recipientEmail').isEmail().withMessage('Invalid email address'),
  body('senderEmail').isEmail().withMessage('Invalid email address'),
  body('message').notEmpty().withMessage('Message cannot be empty'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateContactForm;
