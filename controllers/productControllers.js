const productModel = require("../models/productModel");
const fs = require("fs");

const makeSlug = (name) => {
  return name.trim().split(/\s+/).join("-");
};

// Create products
const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({
          success: false,
          message: "Name is required",
        });
      case !description:
        return res
          .status(500)
          .send({ success: false, message: "Description is required" });
      case !price:
        return res
          .status(500)
          .send({ success: false, message: "Price is required" });
      case !category:
        return res
          .status(500)
          .send({ success: false, message: "Category is required" });
      case !quantity:
        return res
          .status(500)
          .send({ success: false, message: "Quantity is required" });
      case !photo || photo.size > 1000000:
        return res.status(500).send({
          success: false,
          message: "Photo is required & must be less than 1Mb",
        });
    }

    const product = await productModel.create({
      ...req.fields,
      slug: makeSlug(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//Get-all products
const getProductsController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).send({
      success: true,
      totalCount: product.length,
      message: "Got All Products ",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in geting products",
      error,
    });
  }
};

//Get-single product
const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.findOne({ slug }).select('-photo').populate('category');
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Got product successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting a product",
      error,
    });
  }
};

//Get product photo
const getProductPhotoController = async (req, res) => {
  try {
    //pid = product id
    const {pid} = req.params;
    //select helps to select only the photo
    const productPhoto = await productModel.findById(pid).select('photo');
    
    if(productPhoto.photo.data){
      res.set('Content-type', productPhoto.photo.contentType);
      res.status(200).send(productPhoto.photo.data)
    }

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error
    })
  }
}

//Update product by ID
const updateProductController = async (req, res) => {
  try {
    const {pid} = req.params;
    const {name} = req.fields;
    const {photo} = req.files;
    //validation
    if(photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "Photo must be less than 1MB"
      })
    }
    //if name make the slug and insert it in req field
    if(name){
      req.fields.slug = makeSlug(name);
    }

    //updating ...
    const product = await productModel.findByIdAndUpdate(pid, {...req.fields}, {new: true})
    //if photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating the product",
      error
    })
  }
}

//DELET product by ID
const deleteProductController = async (req, res) => {
  try {
    const {pid} = req.params;
    const product = await productModel.findByIdAndDelete(pid).select('-photo');
    if(!product) {
      return res.status(404).send({
        success: false,
        message: "No product"
      })
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product
    })

  } catch (error) {
    res.status(500).send({
      success: false, 
      message: "Error while deleting product",
      error
    })
  }
}

module.exports = {
  createProductController,
  getProductsController,
  getSingleProductController,
  getProductPhotoController,
  updateProductController,
  deleteProductController
};
