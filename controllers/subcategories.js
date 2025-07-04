import subcategoriesModel from '../models/subcategoriesModel.js';
import { getAll, getOne, createOne, updateOne, deleteOne } from './refactorHandler.js';

const getSubcategories = getAll(subcategoriesModel, "subCategory");
const getSubcategory = getOne(subcategoriesModel, "products");
const createSubcategory = createOne(subcategoriesModel);
const updateSubcategory = updateOne(subcategoriesModel);
const deleteSubcategory = deleteOne(subcategoriesModel);

export {
  getSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};