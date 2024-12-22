const MonthlyDonationService = require('./MonthlyDonationService');

class MonthlyDonationController {
  async create(req, res) {
    try {
      const newDonation = await MonthlyDonationService.create(req.body);
      res.status(201).json(newDonation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllMonthlyDonations(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, sortField, sortOrder } = req.query;

    try {
      const result = await MonthlyDonationService.getAllMonthlyDonations(
        page, limit, status, sortField, sortOrder
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllMonthlyDonationsByDonor(req, res) {
    const donorId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, sortField, sortOrder } = req.query;

    try {
      const result = await MonthlyDonationService.getAllMonthlyDonationsByDonor(
        page, limit, donorId, status, sortField, sortOrder
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMonthlyDonationById(req, res) {
    const monthlyDonationId = req.params.id;
    try {
      const result = await MonthlyDonationService.getMonthlyDonationById(monthlyDonationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    const monthlyDonationId = req.params.id;
    const data = req.body;
    try {
      const updatedDonation = await MonthlyDonationService.update(monthlyDonationId, data);
      res.status(200).json(updatedDonation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async cancel(req, res) {
    const monthlyDonationId = req.params.id;
    try {
      const canceledDonation = await MonthlyDonationService.cancel(monthlyDonationId);
      res.status(200).json(canceledDonation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MonthlyDonationController();
