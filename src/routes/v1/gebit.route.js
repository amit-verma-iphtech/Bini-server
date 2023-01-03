const express = require('express');
const { gebitController } = require('../../controllers');

const router = express.Router();

router.post('/check-in', gebitController.gebitCheckIn);
router.post('/check-out', gebitController.gebitCheckOut);
router.get('/customers', gebitController.gebitCurrentCustomers);
router.post('/create-visit', gebitController.createGebitVisit);
router.post('/exit-visit', gebitController.exitGebitVisit);

module.exports = router;
