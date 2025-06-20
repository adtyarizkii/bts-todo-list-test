const router = require('express').Router();
const auth = require('../middlewares/auth');
const { checklistController } = require('../controllers');

router.post('/', auth, checklistController.createChecklist);
router.get('/', auth, checklistController.getChecklists);
router.get('/:id', auth, checklistController.getChecklistDetail);
router.delete('/:id', auth, checklistController.deleteChecklist);

module.exports = router;
