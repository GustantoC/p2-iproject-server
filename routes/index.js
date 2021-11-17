const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const MangaController = require('../controllers/MangaController');
const Authenticate = require('../middlewares/Auth')
const ErrorHandler = require('../middlewares/ErrorHandler')




router.post('/login', AuthController.login)
router.post('/google-signin', AuthController.verifyGoogle)
router.post('/register', AuthController.register)
router.get('/verifyToken', AuthController.verifyToken)
router.get('/getAnime/:subtype',MangaController.getTop50)
router.get('/getManga',MangaController.getMangaQuery)
router.get('/getDetail/:MalId',MangaController.getMangaQuery)


router.use(Authenticate)
router.post('/addToBookmark/:MalId', MangaController.addToBookmark)
router.use(ErrorHandler)

module.exports = router