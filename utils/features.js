class Features {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["sort", "fields", "search", "page", "limit"];
    excludedFields.forEach((field) => { delete queryStringObj[field] });
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.search) {
      let query = {};
      if (modelName === "products") {
        query.$or = [
          { name: new RegExp(this.queryString.search, "i") },
          { description: new RegExp(this.queryString.search, "i") },
        ];
      } else {
        query = { name: new RegExp(this.queryString.search, "i") };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(documentsCount) {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 15;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = (page);
    pagination.limit = Number(limit);
    pagination.totalpages = Math.ceil(documentsCount / limit);
    if (endIndex < documentsCount) {
      pagination.next = Number(page) + 1;
    }
    if (skip > 0) {
      pagination.prev = Number(page) - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

}

export default Features;