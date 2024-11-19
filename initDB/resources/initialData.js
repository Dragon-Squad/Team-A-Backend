const initialData = {
    admin: {
      email: 'admin@charitan.com',
      password: 'adminpassword',
      role: 'Admin',
    },
    charities: [
      { type: 'individual', country: 'Vietnam', companyName: 'Individual VN' },
      { type: 'individual', country: 'USA', companyName: 'Individual USA' },
      { type: 'corporate', country: 'South Africa', companyName: 'Company SA' },
      { type: 'corporate', country: 'Germany', companyName: 'Company DE' },
      { type: 'non-profit', country: 'Ukraine', companyName: 'Non-profit UA' },
      { type: 'non-profit', country: 'Israel', companyName: 'Non-profit IL' },
    ],
    categories: ['Food', 'Health', 'Education', 'Environment', 'Religion', 'Humanitarian', 'Housing', 'Other'],
    regions: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'],
    globalProjects: [
      {
        title: 'Middle East Crisis',
        description: 'Aid for Middle East Crisis',
        duration: '6 months',
        goalAmount: 1000000,
        charityCompanyName: 'Non-profit IL',
        category: 'Health',
        region: 'Africa' 
      },
      {
        title: 'Ukraine - Russia War',
        description: 'Support for Ukraine in the Russia-Ukraine conflict',
        duration: '12 months',
        goalAmount: 2000000,
        charityCompanyName: 'Non-profit UA',
        category: 'Humanitarian', 
        region: 'Europe', 
      },
      {
        title: 'Food Program in South Africa',
        description: 'Food aid in Southern Africa',
        duration: '3 months',
        goalAmount: 500000,
        charityCompanyName: 'Company SA',
        category: 'Food', 
        region: 'Africa', 
      },
    ],
    
    localProjects: [
      {
        title: 'Yagi Typhoon Support',
        description: 'Support for Yagi Typhoon victims in Vietnam',
        duration: '3 months',
        goalAmount: 300000,
        charityCompanyName: 'Individual VN',
        category: 'Humanitarian',
        region: 'Asia', 
        country: 'VN'
      },
      {
        title: 'Milton Hurricane Support',
        description: 'Support for Milton Hurricane victims in the USA',
        duration: '3 months',
        goalAmount: 300000,
        charityCompanyName: 'Individual USA',
        category: 'Humanitarian', 
        region: 'North America', 
        country: 'US'
      },
      {
        title: 'Helping Ukrainian Refugee',
        description: 'Aid for Ukrainian refugees in Germany',
        duration: '3 months',
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        category: 'Humanitarian', 
        region: 'Europe',
        country: 'UA'
      },
      {
        title: "Supporting SOS Children’s Village",
        description: "Support for SOS Children's Village in China",
        duration: '3 months',
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        category: 'Education', 
        region: 'Asia', 
        country: 'CN'
      },
    ],
  };
  
  module.exports = initialData;
    