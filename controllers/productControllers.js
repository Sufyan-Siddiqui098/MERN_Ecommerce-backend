const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel"); //For category specific call
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

//Get-all products -- Not using for better UI - Instead using the API which return product in pieces i.e.(getProductListController)
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
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");
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
    const { pid } = req.params;
    //select helps to select only the photo
    const productPhoto = await productModel.findById(pid).select("photo");

    if (productPhoto.photo.data) {
      res.set("Content-type", productPhoto.photo.contentType);
      res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

//Update product by ID
const updateProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    let slug;
    const { photo } = req.files;
    //validation
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "Photo must be less than 1MB",
      });
    }
    //if name make the slug and insert it in req field
    if (name) {
      slug = makeSlug(name);
    }

    //updating ...
    const product = await productModel.findByIdAndUpdate(
      pid,
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug,
      },
      { new: true }
    );
    //if photo and photo.path is present
    if (photo && photo.path) {
      product.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
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
      error,
    });
  }
};

//DELET product by ID
const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findByIdAndDelete(pid).select("-photo");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "No product",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//Filter product by category OR Price
const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const filterProduct = await productModel.find(args).select("-photo");
    if (!filterProduct) {
      res.status(200).send({
        success: false,
        message: "No product found!",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product filter successfully",
      filterProduct,
      totalCount: filterProduct.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while filtering product",
      error,
    });
  }
};

//Get Product Count
const getProductCountController = async (req, res) => {
  try {
    const product = await productModel.find({}).select("-photo");
    if (!product) {
      res.status(404).send({
        success: false,
        message: "Empty products",
      });
    }

    res.status(200).send({
      success: true,
      totalCount: product.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while geting product count",
      error,
    });
  }
};

//Get Product list based on pages
const getProductListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params ? req.params.page : 1;
    const product = await productModel
      .find({})
      .select("-photo")
      .sort({ createdAt: -1 })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage);
    if (!product) {
      res.status(400).send({
        success: false,
        message: "No more products",
      });
    }

    res.status(200).send({
      success: true,
      message: "Got the products",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting product list",
      error,
    });
  }
};

//Get Filter product list
const getSearchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "No Match found",
      });
    }
    // filtered result
    res.status(200).send({
      success: true,
      message: "Product found !",
      result,
    });
  } catch (error) {
    res.status(400).send({
      success: fasle,
      message: "Error while getting filtered result",
      error,
    });
  }
};

//Related Product
const getRelatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const relatedProduct = await productModel
      .find({
        _id: { $ne: pid },
        category: cid,
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    if (!relatedProduct || relatedProduct.length < 1) {
      return res.status(200).send({
        success: false,
        message: "No related products is present",
      });
    }

    res.status(200).send({
      success: true,
      message: "Related products found",
      relatedProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

//GET - Category specific products
const getCategoryRelatedProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Invalid category",
      });
    }
    const product = await productModel.find({ category }).select('-photo').populate("category");
    if (!product) {
      return res.status(400).send({
        success: true,
        message: "No product found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Got Category specific Products",
      category,
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

module.exports = {
  createProductController,
  getProductsController,
  getSingleProductController,
  getProductPhotoController,
  updateProductController,
  deleteProductController,
  filterProductController,
  getProductCountController,
  getProductListController,
  getSearchProductController,
  getRelatedProductController,
  getCategoryRelatedProduct
};
