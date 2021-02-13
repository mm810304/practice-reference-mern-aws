const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/categoryValidator');
const { runValidation } = require('../validators/validator');
const { requireSignin, userAuth, adminAuth } = require('../middleware/authMiddleware');

router.post('/category', createCategoryValidator, runValidation, requireSignin, adminAuth, categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.post('/category/:slug', categoryController.getSingleCategory);
router.put('/category/:slug', updateCategoryValidator, runValidation, requireSignin, adminAuth, categoryController.updateCategory);
router.delete('/category/:slug', requireSignin, adminAuth, categoryController.removeCategory);

module.exports = router;
