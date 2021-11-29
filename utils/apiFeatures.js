class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter = () => {
    const queryObj = { ...this.queryString };
    const excludes = ['page', 'sort', 'limit', 'fields'];

    excludes.forEach((e) => delete queryObj[e]);
    console.log(queryObj);

    const mongoBoolRegex = /\b(gte|gt|lte|lt)\b/g;

    let sringifiedQuery = JSON.stringify(queryObj);

    sringifiedQuery = sringifiedQuery.replace(
      mongoBoolRegex,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(sringifiedQuery));
    //let query = Tour.find();
    return this;
  };
  sort = () => {
    //2 Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  };
  limitFields = () => {
    //3 fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  };
  paginate = () => {
    const page = +this.queryString || 1;
    const limit = +this.queryString || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  };
}
module.exports = APIFeatures;
