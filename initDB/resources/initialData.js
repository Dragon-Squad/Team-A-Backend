const initialData = {
    admin: {
      email: 'admin@charitan.com',
      password: 'adminpassword',
    },
    charities: [
      { type: 'Person', country: 'Vietnam', companyName: 'Individual VN', category: ['Humanitarian'], region: ['Asia'] , avatar: "logo1.jpg"},
      { type: 'Person', country: 'USA', companyName: 'Individual USA' , category: ['Humanitarian'], region: ['North America'], avatar: "logo2.jpg"},
      { type: 'Company', country: 'South Africa', companyName: 'Company SA', category: ['Food'], region: ['Africa'], avatar: "logo3.jpg"},
      { type: 'Company', country: 'Germany', companyName: 'Company DE' , category: ['Humanitarian', 'Education'], region: ['Europe, Asia'], avatar: "logo4.jpg"},
      { type: 'Non-profit Organization', country: 'Ukraine', companyName: 'Non-profit UA' , category: ['Humanitarian'], region: ['Europe'], avatar: "logo5.jpg" },
      { type: 'Non-profit Organization', country: 'Israel', companyName: 'Non-profit IL' , category: ['Health'], region: ['Africa'], avatar: "logo6.jpg"},
    ],
    categories: ['Food', 'Health', 'Education', 'Environment', 'Religion', 'Humanitarian', 'Housing', 'Other'],
    regions: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'],
    globalProjects: [
      {
        title: 'Middle East Crisis',
        description: 'Aid for Middle East Crisis',
        duration: 6,
        goalAmount: 1000000,
        charityCompanyName: 'Non-profit IL',
        category: 'Health',
        region: 'Africa',

      },
      {
        title: 'Ukraine - Russia War',
        description: 'Support for Ukraine in the Russia-Ukraine conflict',
        duration: 12,
        goalAmount: 2000000,
        charityCompanyName: 'Non-profit UA',
        category: 'Humanitarian', 
        region: 'Europe', 
      },
      {
        title: 'Food Program in South Africa',
        description: 'Food aid in Southern Africa',
        duration: 3,
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
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Individual VN',
        category: 'Humanitarian',
        region: 'Asia', 
        country: 'VN'
      },
      {
        title: 'Milton Hurricane Support',
        description: 'Support for Milton Hurricane victims in the USA',
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Individual USA',
        category: 'Humanitarian', 
        region: 'North America', 
        country: 'US'
      },
      {
        title: 'Helping Ukrainian Refugee',
        description: 'Aid for Ukrainian refugees in Germany',
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        category: 'Humanitarian', 
        region: 'Europe',
        country: 'UA'
      },
      {
        title: "Supporting SOS Children’s Village",
        description: "Support for SOS Children's Village in China",
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        category: 'Education', 
        region: 'Asia', 
        country: 'CN'
      },
    ],
  };
  
  module.exports = initialData;
    