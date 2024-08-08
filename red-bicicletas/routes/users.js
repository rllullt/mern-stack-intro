const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario');

router.get('/', usuarioController.list);
router.get('/create', usuarioController.create_get);
router.get('/:id/update', usuarioController.update_get);

router.post('/create', usuarioController.create);
router.post('/:id/update', usuarioController.update)
router.post('/:id/delete', usuarioController.delete);

/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

module.exports = router;
