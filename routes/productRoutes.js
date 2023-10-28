const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductsController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductController,
  updateProductController,
  filterProductController,
} = require("../controllers/productControllers");
const formidableMiddleware = require("express-formidable");

const router = express.Router();

// Create Product || POST
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);
//Get all products || GET
router.get("/get-products", getProductsController);
//Get single Product || GET
router.get("/get-product/:slug", getSingleProductController);
//Update Product || PUT
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);
//DELETE product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//Get product PHOTO
router.get("/product-photo/:pid", getProductPhotoController);

//Get filter product || POST
router.post("/filter-product", filterProductController);

module.exports = router;
