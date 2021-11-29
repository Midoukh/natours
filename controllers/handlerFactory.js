const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;
    const doc = await Model.findByIdAndRemove(docId);

    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const createdDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: createdDoc,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;

    const doc = await Model.findByIdAndUpdate(docId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with this id', 404));
    }

    res.status(200).json({
      statuz: 'Success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //1 Filtering

    //4 Pagination
    //example page=2&limit=10
    //to allow nested routes get reviews in tour
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    features.sort();

    const docs = await features.query;
    console.log(docs);

    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //check if id exist

    const docId = req.params.id;

    let query = Model.findById(docId);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError('No tour found with this id', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });
