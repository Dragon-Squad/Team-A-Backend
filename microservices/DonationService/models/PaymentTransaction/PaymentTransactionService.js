const PaymentTransactionRepository = require('./PaymentTransactionRepository');

class PaymentTransactionService {
  async create(data) {
    try{
        const result = await PaymentTransactionRepository.create(data);
        return result
    } catch (error){
        throw new Error('Error: ' + error.message);
    }
  }

  async findById(id) {
    try{
        const result = await PaymentTransactionRepository.findById(id);
        return result;
    } catch (error){
        throw new Error('Error: ' + error.message);
    }
  }
}

module.exports = new PaymentTransactionService();