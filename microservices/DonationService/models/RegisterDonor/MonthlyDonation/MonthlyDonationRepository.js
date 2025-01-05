const MonthlyDonation = require('./MonthlyDonationSchema');

class MonthlyDonationRepository {
  async create() {
    const monthlyDonation = new MonthlyDonation();
    return await monthlyDonation.save();
  }

  async count() {
    return await MonthlyDonation.countDocuments();
  }

  async findById(id) {
    return await MonthlyDonation.findById(id);
  }

  async getAll(page, limit, status, sortField, sortOrder) {
    let query;

    if (status) {
        query.isActive = status; 
      }

    const totalCount = await MonthlyDonation.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const isLast = currentPage >= totalPages;

    const offset = (page - 1) * limit;
    const sortOptions = {};
    if (sortField && (sortField === 'startedDate' || sortField === 'renewDate')) {
      sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; 
    }

    const data = await MonthlyDonation.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sortOptions);

    return {
      meta: {
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: currentPage,
        pageSize: limit,
        isLast: isLast
      },
      data: data
    };
  }

  async getAllByDonor(page, limit, donorId, status, sortField, sortOrder) {
    const query = { donorId };

    if (status) {
      query.isActive = status; 
    }

    const totalCount = await MonthlyDonation.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const isLast = currentPage >= totalPages;

    const offset = (page - 1) * limit;

    // Sorting options
    const sortOptions = {};
    if (sortField && (sortField === 'startedDate' || sortField === 'renewDate')) {
      sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; 
    }

    const data = await MonthlyDonation.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sortOptions);

    return {
      meta: {
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: currentPage,
        pageSize: limit,
        isLast: isLast
      },
      data: data
    };
  }
  
  async getByStripeSubscriptionId(stripeSubscriptionId){
    return await MonthlyDonation.findOne({ stripeSubscriptionId }).exec();
  }

  async update(id, data) {
    return await MonthlyDonation.findByIdAndUpdate(id, data, { new: true });
  }

  async cancel(id) {
    return await MonthlyDonation.findByIdAndUpdate(id, {
      isActive: false,
      cancelledAt: new Date()
    }, { new: true });
  }
}

module.exports = new MonthlyDonationRepository();
