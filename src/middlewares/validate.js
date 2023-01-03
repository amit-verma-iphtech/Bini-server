const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { RESPONSE_FAILURE, RESPONSE_BAD_REQUEST } = require('../constants/responseMessages');
const { getAllParams } = require('../utils/helper');

const validate = (schema) => async (req, res, next) => {
  if (!schema) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: RESPONSE_FAILURE,
      message: 'Validation schema not found',
    });
  }
  const payload = { ...getAllParams(req) };
  delete payload.token;
  const value = await schema.validate({ ...payload }, { abortEarly: false });
  // const value = await schema.validate({ ...req.body, ...req.params }, { abortEarly: false });

  if (value.error) {
    let message = `${RESPONSE_BAD_REQUEST} from values :`;
    const error = [];
    value.error.details.map((errorData, idx) => {
      const isLast = value.error.details.length === idx + 1;
      message = `${message} ${errorData.context.key}${isLast ? '.' : ','}`;
      return error.push({ [errorData.context.key]: errorData.message });
    });
    return res.status(httpStatus.BAD_REQUEST).json({
      status: RESPONSE_FAILURE,
      message,
      error,
    });
  }
  return next();
};

module.exports = validate;
