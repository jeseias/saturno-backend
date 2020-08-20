const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apifeatures');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.getAll = (Model) => 
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      length: docs.length,
      data: {
        docs
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id).select('-__v');
    if (popOptions) query.populate(popOptions);

    const doc = await query;

    if (!doc)
      return next(new AppError('Document com este ID não existe'));
    
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Eliminando com successo'
    });
  });

exports.updateOne = Model => 
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      validateBeforeSave: true
    });

    res.status(200).json({
      status: 'success',
      data: { doc }
    });
  });