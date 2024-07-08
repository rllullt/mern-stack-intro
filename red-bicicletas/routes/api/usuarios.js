const express = require('express');
const router = express.Router();
const usuarioControllerAPI = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioControllerAPI.usuarios_list);

router.post('/create', usuarioControllerAPI.usuarios_create);
router.post('/reservar', usuarioControllerAPI.usuario_reservar);

module.exports = router;
