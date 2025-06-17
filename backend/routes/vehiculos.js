const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

router.get('/', vehiculosController.getVehiculos);
router.post('/', vehiculosController.createVehiculo);
router.put('/:id', vehiculosController.updateVehiculo);
router.delete('/:id', vehiculosController.deleteVehiculo);

module.exports = router;