const Donation = require('./DonationSchema');

class DonationRepository {
  async create(data) {
    const donation = new Donation(data);
    return await donation.save();
  }
  
  async count() {
    return await Donation.countDocuments();
  }

  async findById(id) {
    return await Donation.findById(id);
  }

  async getAll(limit, page) {
    const totalCount = await Donation.countDocuments();  
    const totalPages = Math.ceil(totalCount / limit);     
    const currentPage = page;                             
    const isLast = currentPage >= totalPages;            

    const offset = (page - 1) * limit;
    const data = await Donation.find()
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

  async getAllByDonor(limit, page, donorId) {
    const totalCount = await Donation.countDocuments({ donor: donorId });  
    const totalPages = Math.ceil(totalCount / limit);                       
    const currentPage = page;                                          
    const isLast = currentPage >= totalPages;                             

    const offset = (page - 1) * limit;
    const data = await Donation.find({ donor: donorId })
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

  async getAllByProject(limit, page, projectId) {
    const totalCount = await Donation.countDocuments({ project: projectId }); 
    const totalPages = Math.ceil(totalCount / limit);                         
    const currentPage = page;                                               
    const isLast = currentPage >= totalPages;                                

    const offset = (page - 1) * limit;
    const data = await Donation.find({ project: projectId })
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

  async countByDonor(donorId) {
    return await Donation.countDocuments({ donor: donorId });
  }

  async countByProject(projectId) {
    return await Donation.countDocuments({ project: projectId });
  }
}

module.exports = new DonationRepository();
