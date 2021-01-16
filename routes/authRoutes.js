const { Router } = require('express');
const authController = require('../controllers/authController');
const questionController = require('../controllers/questionController');

//backend
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//questionController Routes - should probably be it's own file but wasn't sure about duplicating router
router.post('/ask', questionController.question_post);
router.get('/question', questionController.question_get);
router.get('/question/:questionId', questionController.get_single_question);
router.post('/answer', questionController.post_answer);
router.get('/', questionController.question_get_page);
router.get('/:index', questionController.question_get_page);

module.exports = router;