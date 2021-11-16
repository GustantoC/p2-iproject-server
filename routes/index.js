const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const Authenticate = require('../middlewares/Auth')
const ErrorHandler = require('../middlewares/ErrorHandler')




router.post('/login', AuthController.login)
router.post('/google-signin', AuthController.verifyGoogle)
router.post('/register', AuthController.register)
router.get('/verifyToken', AuthController.verifyToken)
router.get('/topMangas')
router.use(Authenticate)

router.use(ErrorHandler)

module.exports = router