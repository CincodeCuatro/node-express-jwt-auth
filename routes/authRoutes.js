const { Router } = require('express');
const authController = require('../controllers/authController');

//backend
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.post('/ask', authController.question_post);
router.get('/question', authController.question_get);

module.exports = router;