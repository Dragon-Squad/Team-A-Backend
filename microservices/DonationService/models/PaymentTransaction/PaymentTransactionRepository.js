const PaymentTransaction = require("./PaymentTransactionSchema");

class PaymentTransactionRepository {
    async create(data) {
        const paymentTransaction = new PaymentTransaction(data);
        return await paymentTransaction.save();
    }

    async findById(id) {
        return await PaymentTransaction.findById(id);
    }
}

module.exports = new PaymentTransactionRepository();
