const router = require('express').Router();
const auth = require('../middlewares/auth');
const { itemController } = require('../controllers');

router.post('/:checklistId', auth, itemController.addItem);
router.put('/:id', auth, itemController.updateItem);
router.patch('/:id/status', auth, itemController.toggleStatus);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
