import asyncHandler from "express-async-handler";

const setCategoryId = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

const setLoggedInUserId = asyncHandler(
  async (req, res, next) => {
    req.params.id = req.user?._id.toString();
    next();
  }
);

const setBrandId = (req, res, next) => {
  if (!req.body.brand) {
    req.body.brand = req.params.brandId;
  }
  next();
};

const setProductAndUserId = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user?._id;
  }
  next();
};

const setLoggedInOwnerId = asyncHandler(
  async (req, res, next) => {
    req.body.owner = req.user?._id.toString();
    next();
  }
);

const setLoggedInUserIdAndOwnerId = asyncHandler(
  async (req, res, next) => {
    req.body.user = req.user?._id.toString();
    next();
  }
);

export {
  setCategoryId,
  setLoggedInUserId,
  setBrandId,
  setProductAndUserId,
  setLoggedInOwnerId,
  setLoggedInUserIdAndOwnerId
}