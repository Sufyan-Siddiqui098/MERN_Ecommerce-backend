const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, getAllCategoriesController, getSingleCategoryController, deleteCategoryController } = require('../controllers/categoryControllers');

const router = express.Router();

//Get All categories | GET
router.get('/all-categories', getAllCategoriesController)

//Get Specific Category | GET
router.get('/get-category/:slug', getSingleCategoryController)

//Create category | POST
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//Update Category | PUT
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//Delete Category | DELETE
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)


module.exports = router
