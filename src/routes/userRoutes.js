const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// O authMiddleware é aplicado em todas as rotas deste arquivo
router.use(authMiddleware);

router.get('/me', userController.me);
router.get('/', userController.list);

module.exports = router;