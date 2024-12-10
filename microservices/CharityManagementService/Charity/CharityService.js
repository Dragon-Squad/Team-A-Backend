const CharityRepository = require('./CharityRepository');
const {disconnectConsumer} = require("../broker/MessageConsumer");
const MessageProducer = require("../broker/MessageProducer");

class CharityService {
  async searchByName(search) {
    const result = await CharityRepository.searchByName(search);
  
    // Convert each ObjectId in the result to a string
    const stringifiedResult = result.map(id => id.toString());

    console.log("Send back the result");
    await MessageProducer.publish({
      topic: "charity_to_project",
      event: "search_charity_response",
      message: stringifiedResult,
    });

    return stringifiedResult;
  }
}

module.exports = new CharityService();