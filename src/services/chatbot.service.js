const ChatbotStatemachine = require('../utils/StatemachineChatBot');
const tagService = require('./tag.service');
const itemService = require('./item.service');

const chatBotSettings = {
  getProducts,
  checkout: (a) => {},
};

const chatbot = new ChatbotStatemachine(chatBotSettings);

async function processText(text, mobileNo) {
  const response = await chatbot.processText(text, mobileNo);
  return response;
}

function getStates() {
  const { states } = chatbot;
  return states;
}

/// ////////////////////
// examples:
/// /////////////////////

async function getProducts(keywordList) {
  const tag = await tagService.getHighestPriorityTagByKeywordList(keywordList);

  const items = await itemService.getItemsFitKeyword(tag.text);
  const topFiveItems = items.slice(0, 5);

  return topFiveItems;
}

module.exports = {
  processText,
  getStates,
};
