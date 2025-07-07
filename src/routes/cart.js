const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', auth, cartController.getCart);
router.post('/items', auth, cartController.addToCart);
router.put('/items/:id', auth, cartController.updateCartItem);
router.delete('/items/:id', auth, cartController.removeFromCart);

module.exports = router;