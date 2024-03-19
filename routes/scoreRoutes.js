const express = require('express')
const scoreController = require('../controllers/score-controller')

const router = express.Router()

router.get('/', scoreController.score_index)
router.post('/', scoreController.score_create_post)

module.exports = router