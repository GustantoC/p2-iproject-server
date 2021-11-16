const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const MangaController = require('../controllers/MangaController');
const Authenticate = require('../middlewares/Auth')
const ErrorHandler = require('../middlewares/ErrorHandler')




router.post('/login', AuthController.login)
router.post('/google-signin', AuthController.verifyGoogle)
router.post('/register', AuthController.register)
router.get('/verifyToken', AuthController.verifyToken)
router.get('/top50Mangas',MangaController.topMangas)
router.use(Authenticate)
router.post('/manga',MangaController.insertNewManga)
router.use(ErrorHandler)

module.exports = router