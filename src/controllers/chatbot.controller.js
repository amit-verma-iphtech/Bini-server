const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { chatbotService } = require('../services');

const wa_processText = catchAsync(async (req, res) => {
  const triggerPayload = req.body;

  const { text } = triggerPayload.message.content;
  const fromMobileNo = triggerPayload.message.from;

  const chatResponse = chatbotService.processText(text, fromMobileNo);

  // todo: send to whatsapp

  res.status(httpStatus.OK).send();
});

const test_processText = catchAsync(async (req, res) => {
  const triggerPayload = req.body;

  const { text } = triggerPayload;
  const fromMobileNo = triggerPayload.from;

  const chatResponse = await chatbotService.processText(text, fromMobileNo);

  res.status(httpStatus.OK).send(chatResponse);
});

module.exports = {
  test_processText,
  wa_processText,
};

//---------------------------------------------
// MessageBird docs: https://developers.messagebird.com/api/conversations/#handle-webhooks
//---------------------------------------------

/*
{
    "type": "message.created",
    "contact": {
      "id": "9354647c5b144a2b4c99f2n42497249",
      "href": "https://rest.messagebird.com/1/contacts/9354647c5b144a2b4c99f2n42497249",
      "msisdn": 316123456789,
      "firstName": "Jen",
      "lastName": "Smith",
      "customDetails": {
        "custom1": null,
        "custom2": null,
        "custom3": null,
        "custom4": null
      },
      "createdDatetime": "2018-06-03T20:06:03Z",
      "updatedDatetime": null
    },
    "conversation": {
      "id": "2f719ebc5b144a18b75f44n12188288",
      "contactId": "9354647c5b144a2b4c99f2n42497249",
      "status": "active",
      "createdDatetime": "2018-03-28T13:28:00Z",
      "updatedDatetime": "2018-03-28T13:28:00Z",
      "lastReceivedDatetime": "2018-03-28T13:28:00Z",
      "lastUsedChannelId": "2f719ebc5b144a18b75f44n12188288",
      "lastUsedPlatformId": "sms"
    },
    "message": {
      "id": "8909570c5b71a40bb957f1n63383684",
      "conversationId": "2f719ebc5b144a18b75f44n12188288",
      "channelId": "2f719ebc5b144a18b75f44n12188288",
      "status": "delivered",
      "type": "text",
      "direction": "sent",
      "content": {
        "text": "hello"
      },
      "createdDatetime": "2018-08-13T15:30:19Z",
      "updatedDatetime": "2018-08-13T15:30:20Z",
      "from":"+491736989366",
      "to":"+4915226103111",
      "origin": "inbound",
      "platform" : "whatsapp",

    }
  }

  */
