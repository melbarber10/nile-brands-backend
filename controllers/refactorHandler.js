import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import apiErrors from "../utils/apiErrors.js";
import Features from "../utils/features.js";

const getAll = (model, modelName) => asyncHandler(async (req, res) => { 
  let filterData = {};
  let searchLength = 0;

  if (req.filterData) {
    filterData = req.filterData;
  }

  if (req.query.search) {
    const searchResult = new Features(
      model.find(filterData),
      req.query
    )
      .filter()
      .search(modelName);
    const searchData = await searchResult.mongooseQuery;
    searchLength = searchData.length;
  }

  const documentsCount = searchLength || (await model.find(filterData).countDocuments());
  const apiFeatures = new Features(
    model.find(filterData),
    req.query
  ).filter().sort().limitFields().search(modelName).pagination(documentsCount);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const documents = await mongooseQuery;
  if (documents.length === 0) {
    throw new apiErrors("No documents found with the provided query",
      StatusCodes.NOT_FOUND)
  }

  res.status(StatusCodes.OK).json({
    length: documents.length,
    pagination: paginationResult, data: documents });
})

const getOne = (model, population) => asyncHandler(async (req, res) => {
  let query = model.findById(req.params.id);
  if (population) {
    query = query.populate(population);
  }
  const document = await query;
  if (!document) {
    throw new apiErrors(`No document found with ID: ${req.params.id}`, StatusCodes.NOT_FOUND);
  } 
  res.status(StatusCodes.OK).json({ data: document });
})

const createOne = (model) => asyncHandler(async (req, res) => {
  const document = await model.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: document });
})

const updateOne = (model) => asyncHandler(async (req, res) => {
  const document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!document) {
    throw new apiErrors(`No document found with ID: ${req.params.id}`, StatusCodes.NOT_FOUND);
  }
  document.save();
  res.status(StatusCodes.OK).json({ data: document });
})

const deleteOne = (model) => asyncHandler(async (req, res) => {
  const document = await model.findOneAndDelete({ _id: req.params.id });
  if (!document) {
    throw new apiErrors(`No document found with ID: ${req.params.id}`, StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.NO_CONTENT).json();
})

export { getAll, getOne, createOne, updateOne, deleteOne };