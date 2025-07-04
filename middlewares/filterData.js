const filterSubcategories = (req, res, next) => {
  req.filterData = req.params.categoryId ? { category: req.params.categoryId } : {};
  next();
};
const filterBrandProducts = (req, res, next) => {
  req.filterData = req.params.brandId ? { brand: req.params.brandId } : {};
  next();
};

const filterReviews = (req, res, next) => {
  req.filterData = req.params.productId ? { product: req.params.productId } : {};
  next();
};

const filterUserOrders = (req, res, next) => {
  req.user?.role === "user" ? req.filterData = { user: req.user._id } : {};
  next();
};

export { filterSubcategories, filterBrandProducts, filterReviews, filterUserOrders };