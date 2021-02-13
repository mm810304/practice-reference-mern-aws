const express = require('express');

const router = express.Router();

const linkController = require('../controllers/linkController');
const { createLinkValidator, updateLinkValidator } = require('../validators/linkValidator');
const { runValidation } = require('../validators/validator');
const { requireSignin, userAuth, adminAuth, canUpdateDeleteLink } = require('../middleware/authMiddleware');

router.post('/link', createLinkValidator, runValidation, requireSignin, userAuth, linkController.createLink);
router.post('/links', requireSignin, adminAuth, linkController.getAllLinks);
router.put('/click-count', linkController.clickCount);
router.get('/link/popular', linkController.getMostPopularLinks);
router.get('/link/popular/:slug', linkController.getMostPopularInCategory)
router.get('/link/:id', linkController.getSingleLink);
router.put('/link/:id', updateLinkValidator, runValidation, requireSignin, userAuth, canUpdateDeleteLink, linkController.updateLink);
router.delete('/link/:id', requireSignin, userAuth, canUpdateDeleteLink, linkController.removeLink);
router.put('/link/admin/:id', updateLinkValidator, runValidation, requireSignin, adminAuth, linkController.updateLink);
router.delete('/link/admin/:id', requireSignin, adminAuth, linkController.removeLink);

module.exports = router;
