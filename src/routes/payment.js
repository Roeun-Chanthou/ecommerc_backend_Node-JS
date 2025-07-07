const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.post('/', auth, paymentController.createPayment);
router.get('/:orderId', auth, paymentController.getPaymentByOrder);

module.exports = router;