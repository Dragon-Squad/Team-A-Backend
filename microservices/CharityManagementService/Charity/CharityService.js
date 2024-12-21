const CharityRepository = require('./CharityRepository');
const {disconnectConsumer} = require("../broker/MessageConsumer");
const MessageProducer = require("../broker/MessageProducer");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

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

  async updatePaymentMethod(id, paymentMethodId) {
    try{
      const charity = await CharityRepository.findById(id);
      if (!charity ) {
        throw new Error('Charity not found');
      }

      const stripeUserId =  charity.stripeId;
      if (!stripeUserId) {
        throw new Error('Stripe User ID not found');
      }

      if (!paymentMethodId){
        throw new Error('Payment Method is not provided');
      }

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeUserId,
      });
  
      // Optionally, set this payment method as the default for the customer
      await stripe.customers.update(stripeUserId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error){
      throw new Error(error.message);
    }
  }
}

module.exports = new CharityService();