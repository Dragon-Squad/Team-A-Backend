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
    const totalCount = await Donation.countDocuments({ donorId: donorId });  
    const totalPages = Math.ceil(totalCount / limit);                       
    const currentPage = page;                                          
    const isLast = currentPage >= totalPages;                             

    const offset = (page - 1) * limit;
    const data = await Donation.find({ donorId: donorId })
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
    const totalCount = await Donation.countDocuments({ projectId: projectId }); 
    const totalPages = Math.ceil(totalCount / limit);                         
    const currentPage = page;                                               
    const isLast = currentPage >= totalPages;                                

    const offset = (page - 1) * limit;
    const data = await Donation.find({ projectId: projectId })
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
}

module.exports = new DonationRepository();
