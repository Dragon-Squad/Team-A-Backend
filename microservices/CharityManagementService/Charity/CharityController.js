const CharityService = require('./CharityService');

class CharityController {
  async searchByName(req, res) {
    try {
      const search = req.query.search;
      const results = await CharityService.searchByName(search);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePaymentMethod(req, res) {
    try {
      const charityId = req.params.id;
      const paymentMethodId = req.body.paymentMethodId;
      
      await CharityService.updatePaymentMethod(charityId, paymentMethodId);

      res.status(200).json({ message: 'Payment method updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CharityController();