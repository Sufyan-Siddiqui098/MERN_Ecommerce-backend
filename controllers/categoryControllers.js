const categoryModel = require("../models/categoryModel");

// Make slug Function
const makeSlug = (name) => {
  return name.trim().split(/\s+/).join("-");
}

//Get all categories 
const getAllCategoriesController = async (req, res) => {
  try {
    const category = await categoryModel.find();
    if(!category) {
      return res.status(404).send({
        success: false,
        message: "No Category"
      })
    }

    res.status(200).send({
      success: true,
      message: "Got Categories Successfully",
      category
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in geting Categories",
      error
    })
  }
}

//Get Specific Category
const getSingleCategoryController = async (req, res) => {
  try {
    const {slug} = req.params;
    const category = await categoryModel.findOne({slug});
    // Check the presence of category
    if(!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      })
    } ;

    
    res.status(200).send({
      success: true,
      message: "Got Category Successfully",
      category
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in geting Single Category", 
      error
    })
  }
}

//---- Create Category
const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    // If name isn't present
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Name is required",
      });
    }

    // Check the existance of category
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exist",
      });
    }

    // let slug = name.trim().split(/\s+/).join("-");
    let slug = makeSlug(name)

    const category = await categoryModel.create({
      name,
      slug,
    });

    // FINAL RESPONSE
    res.status(200).send({
      success: true,
      message: "Category created successfully !",
      category,
    });
  } catch (error) {
    console.log("error in create category controller", error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

//---- UPDATE CATEGORY
const updateCategoryController = async (req, res) => {
  try {
    const {name} = req.body;
    const {id} = req.params;
    let slug = makeSlug(name)

    const category = await categoryModel.findByIdAndUpdate(id, {name, slug}, {new: true})
    if(!category) {
      return res.status(404).send({
        success: false,
        message: "Not a category"
      })
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in updating category"
    })
  }
}

//---- DELETE CATEGORY
const deleteCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    if(!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      })
    }
    
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
      category
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Deleting Category",
      error
    })
  }
}



module.exports = {getAllCategoriesController, getSingleCategoryController, createCategoryController, updateCategoryController, deleteCategoryController}