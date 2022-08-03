const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const MangaController = require('../controllers/MangaController');
const CustomController = require('../controllers/CustomController')
const Authenticate = require('../middlewares/Auth')
const ErrorHandler = require('../middlewares/ErrorHandler')



router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.get('/getAnime/:subtype',MangaController.getAnime)
router.get('/getManga',MangaController.getMangaQuery)
router.get('/getDetail/:type/:id',MangaController.getDetail)

router.use(Authenticate)
router.get('/textData',CustomController.sendData)
router.post('/addToMyList/:type/:id', MangaController.addToMyList)
router.get('/myList', MangaController.getMyList)
router.use(ErrorHandler)

module.exports = router