/* eslint-disable camelcase */
const AXIOS = require('axios');

const { notifySlack, sendKafkaMessage } = require('../utils/helper');
const { saveVisitWithStoreCustomerId, updateVisitStoreCustomerId } = require('./visit.service');
const services = require('./index');

const isTestMode = false;
const baseURL = 'https://gngdemo.rp.gebit.de/open-checkout-app-adapter/api';
// const customer_id = '2cd2be6c-7946-4bef-a306-87525b48dbed';

// const store_id = 'a5b79f67-e2f1-4f7c-adea-87cfb09ed2d8'; //store_id is for gebit server
const storeId = 2; // storeId in sql-db

const axios = AXIOS.create({ baseURL });
// use axios as you normally would, but specify httpsAgent in the config
const gebitCheckIn = async (data) => {
  try {
    const { store_id, customer_id } = data;
    const payload = {
      customer_id,
      store_id,
    };
    const response = await axios.post('/customer-store-visit/command/check-in-to-store', { ...payload });
    return { status: true, response: response.data, message: 'successfully checkedIn to gebit' };
  } catch (error) {
    return { status: false, message: 'failed to checkIn to gebit', error: error.message };
  }
};
const gebitCheckOut = async (data) => {
  try {
    const { store_id, customer_id } = data;
    const payload = {
      customer_id,
      store_id,
    };
    const response = await axios.post('/customer-store-visit/command/check-out-from-store', { ...payload });
    return { status: true, response: response.data, message: 'successfully checked out from gebit' };
  } catch (error) {
    return { status: false, message: 'failed to checkOut from gebit', error: error.message };
  }
};

const gebitCurrentCustomers = async (data) => {
  try {
    const { store_id } = data;
    const payload = {
      store_id,
    };
    const response = await axios.post(`/customer-store-visit/request/visits-by-storeid`, { ...payload });
    return { status: true, data: response.data, message: 'successfully received customers' };
  } catch (error) {
    console.log('big error', error);

    return { status: false, message: 'failed to get customers from gebit', error: error.message };
  }
};
const createGebitVisit = async (data) => {
  const { storeCustomerId } = data;
  const visitPayload = {
    start: new Date(),
    userId: null,
    storeId,
    noErrorThrow: true,
    storeCustomerId,
  };

  const createdVisit = await saveVisitWithStoreCustomerId(visitPayload);
  if (!createdVisit.alreadyExist) {
    const createdBasket = await services.basketService.createAnonymousVisitBasket(
      {} /* basket body is empty */,
      createdVisit
    );
    // sendKafkaMessage(createdVisit.id);
    notifySlack({
      text: `${isTestMode ? '(Test-message)' : ''}A user entered into gebit store. anonymous-visit: ${
        createdVisit.id
      }, his-basket: ${createdBasket.id}`,
      storeId,
    });
  }
  return createdVisit;
};
const exitGebitVisit = async (data) => {
  const { storeCustomerId } = data;
  const endVisitPayload = {
    end: new Date(),
  };
  const updatedVisit = await updateVisitStoreCustomerId(
    storeCustomerId /* its storeCustomerId in visit table */,
    endVisitPayload
  );

  const updatedBasket = await services.basketService.markPaid(updatedVisit.id);
  notifySlack({
    text: `${isTestMode ? '(Test-message)' : ''}A user just left from gebit store. anonymous-visit: ${
      updatedVisit.id
    }, his-basket: ${updatedBasket.id}`,
    storeId,
  });
};

module.exports = {
  gebitCheckIn,
  gebitCurrentCustomers,
  gebitCheckOut,
  createGebitVisit,
  exitGebitVisit,
};
