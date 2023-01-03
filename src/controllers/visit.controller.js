const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { visitService, basketService } = require('../services');
const services = require('../services');
const { getAllParams } = require('../utils/helper');
const { sendPushNotification } = require('../services/notification.service');
const appPathname = require('../constants/app_navigation.constants');

const createVisit = catchAsync(async (req, res) => {
  const visit = await visitService.createVisit(req.body);
  await services.basketService.createBasket(req.body, visit);
  if (visit.userId)
    await sendPushNotification({
      userId: visit.userId,
      title: 'You entered into the store',
      body: `Visit time: ${visit.start}`,
      navigate: appPathname.basket,
    });

  return res.status(httpStatus.CREATED).send(visit);
});

const getVisits = catchAsync(async (req, res) => {
  const data = req.query;

  const result = await visitService.getAllVisits(data);
  res.send(result);
});

const getVisit = catchAsync(async (req, res) => {
  const visit = await visitService.getVisitById(req.params.visitId);
  if (!visit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  res.send(visit);
});
const getActiveVisitByStoreCustomerId = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const visit = await visitService.getActiveVisitByStoreCustomerId(data);
  if (!visit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  res.send(visit);
});

const getVisitImages = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const response = await visitService.getVisitImages(data);
  res.send(response);
});
const saveAnonymous = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const visit = await visitService.saveAnonymous(data);
  await services.basketService.createBasket(data, visit);
  return res.status(httpStatus.CREATED).send(visit);
});
const makeVisitPayment = async (visit) => {
  // calculate amount...
  let amount = 0;
  visit.basket.items.map((item) => {
    amount += item.price * item.ref_basket_item.count;
    return amount;
  });

  // default response....
  let chargeResponse = { charge: { id: undefined, message: 'No Transaction made', paid: true } };

  // charge amount if more then 0
  if (amount > 0) {
    try {
      // fail if not customerId found
      if (!visit.user.customerId) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Transaction Failed, no customer id available');
      }

      // charge amount
      chargeResponse = await services.stripeService.chargeCustomer({ amount, customerId: visit.user.customerId });
    } catch (error) {
      chargeResponse.charge.paid = false;
      chargeResponse.charge.message = error.message;
    }
  }

  // save transaction details...
  const transactionPayload = {
    userId: visit.user.id,
    visitId: visit.id,
    shippingDateTime: new Date(),

    status: chargeResponse.charge.paid,
    message: chargeResponse.charge.id ? 'Transaction successfully completed!' : chargeResponse.charge.message,
    ...(chargeResponse.charge.id && { uuid: chargeResponse.charge.id }),
  };
  await services.transactionService.createTransaction(transactionPayload);

  // mark basket as paid if status of charge if true...
  if (chargeResponse.charge.paid) {
    await basketService.markPaid(visit.id);
  }

  return chargeResponse;
};

const updateVisit = catchAsync(async (req, res) => {
  const data = getAllParams(req);
  const existingVisit = await visitService.getVisitById(req.params.visitId);
  if (!existingVisit) throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');

  if (existingVisit.end !== null && data.end)
    throw new ApiError(httpStatus.CONFLICT, 'Visitor has already exit, can not exit again');
  const visit = await visitService.updateVisitById(data.visitId, req.body);

  if (data.end) {
    if (existingVisit.basket.isPaid) throw new ApiError(httpStatus.CONFLICT, 'Visitor updated but, payment already made');
    const payment = await makeVisitPayment(existingVisit);

    // if (visit.userId) {
    //   const title = 'Thanks for visiting Bini Store! 🐝';
    //   const subtitle = 'Click here to view your receipt. 🧾';
    //   const body = 'We would love to hear your feedback! 🗣️';
    //   await sendPushNotification({
    //     userId: visit.userId,
    //     title,
    //     subtitle,
    //     body,
    //     navigate: appPathname.history,
    //   });
    // }
    return res.send({ visit, ...payment });
  }
  return res.send({ visit });
  // return res.send(visit);
});

const deleteVisit = catchAsync(async (req, res) => {
  await visitService.deleteVisitById(req.params.visitId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createVisit,
  getVisits,
  getVisit,
  updateVisit,
  deleteVisit,
  getVisitImages,
  saveAnonymous,
  getActiveVisitByStoreCustomerId,
};
