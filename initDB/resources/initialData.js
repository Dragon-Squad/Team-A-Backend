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
    regions: ([
      ['Africa', [
        'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 
        'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Djibouti', 
        'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 
        'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 
        'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 
        'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 
        'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 
        'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
      ]],
      ['Asia', [
        'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 
        'Brunei', 'Cambodia', 'China', 'Cyprus', 'Georgia', 'India', 'Indonesia', 
        'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 
        'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 
        'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 
        'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 
        'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 
        'Uzbekistan', 'Vietnam', 'Yemen'
      ]],
      ['Europe', [
        'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 
        'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 
        'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 
        'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Kosovo', 'Latvia', 
        'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 
        'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 
        'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 
        'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
      ]],
      ['North America', [
        'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 
        'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 
        'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 
        'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'USA'
      ]],
      ['South America', [
        'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 
        'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
      ]],
      ['Australia', [
        'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 
        'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 
        'Tuvalu', 'Vanuatu'
      ]],
      ['Antarctica', []],
      ['Global', []]
    ]),
    globalProjects: [
      {
        title: 'Middle East Crisis',
        description: 'Aid for Middle East Crisis',
        duration: 6,
        goalAmount: 1000000,
        charityCompanyName: 'Non-profit IL',
        categories: ['Health', 'Food'],
        region: 'Global',
        images: ["project1.jpg", "project2.jpg", "project3.jpg"],
        videos: ["video1.mp4"],
      },
      {
        title: 'Ukraine - Russia War',
        description: 'Support for Ukraine in the Russia-Ukraine conflict',
        duration: 12,
        goalAmount: 2000000,
        charityCompanyName: 'Non-profit UA',
        categories: ['Humanitarian'], 
        region: 'Global', 
        images: ["project4.jpg", "project5.jpg"],
      },
      {
        title: 'Food Program in South Africa (Lesotho, Malawi, Namibia, Zambia and Zimbabwe, Mozambique and Angola) ',
        description: 'Food aid in Southern Africa',
        duration: 3,
        goalAmount: 500000,
        charityCompanyName: 'Company SA',
        categories: ['Food'], 
        region: 'Global', 
        images: ["project6.jpg", "project7.jpg"],
      },
    ],
    localProjects: [
      {
        title: 'Yagi Typhoon Support',
        description: 'Support for Yagi Typhoon victims in Vietnam',
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Individual VN',
        categories: ['Humanitarian'],
        region: 'Asia', 
        country: 'Vietnam',
        images: ["project8.jpg", "project9.jpg"],
      },
      {
        title: 'Milton Hurricane Support',
        description: 'Support for Milton Hurricane victims in the USA',
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Individual USA',
        categories: ['Humanitarian'], 
        region: 'North America', 
        country: 'USA',
        images: ["project10.jpg"],
      },
      {
        title: 'Helping Ukrainian Refugee',
        description: 'Aid for Ukrainian refugees in Germany',
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        categories: ['Humanitarian'], 
        region: 'Europe',
        country: 'Germany',
        images: ["project11.jpg", "project12.jpg"],
      },
      {
        title: "Supporting SOS Children’s Village",
        description: "Support for SOS Children's Village in China",
        duration: 3,
        goalAmount: 300000,
        charityCompanyName: 'Company DE',
        categories: ['Education'], 
        region: 'Asia', 
        country: 'China',
        images: ["project13.jpg", "project14.jpg"],
      },
    ],
  };
  
  module.exports = initialData;
    