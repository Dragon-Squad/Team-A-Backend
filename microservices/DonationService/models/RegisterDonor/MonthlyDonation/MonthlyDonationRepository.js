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

  async getAllByDonor(page, limit, userId, status, sortField, sortOrder) {
    const query = { userId };

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

  async getAllByProject(limit, page, projectId) {
      const totalCount = await MonthlyDonation.countDocuments({ projectId: projectId }); 
      const totalPages = Math.ceil(totalCount / limit);                         
      const currentPage = page;                                               
      const isLast = currentPage >= totalPages;                                
  
      const offset = (page - 1) * limit;
      const data = await MonthlyDonation.find({ projectId: projectId })
        .skip(offset)
        .limit(limit);
  
      return {
        meta: {
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

  async getTopMonthlyDonors() {
    try {
      const topDonors = await MonthlyDonation.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$userId',
            totalDonated: { $sum: '$amount' }
          }
        },
        { $sort: { totalDonated: -1 } },
        { $limit: 10 },
      ]);
  
      return topDonors;
    } catch (error) {
      console.error('Error fetching top monthly donors:', error);
      throw error;
    }
  }
}

module.exports = new MonthlyDonationRepository();
