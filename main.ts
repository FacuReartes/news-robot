const axios = require('axios');
const fs = require('fs');
const nodemailer = require("nodemailer");

// File location
const titleFile: string = 'title.txt';

// Create a News class - Structure of final data
interface INews {
  title: string,
  description: string,
  date: string,
  country: string,
  url: string
};

class News implements INews {
  constructor(
    public title: string, 
    public description: string, 
    public date: string, 
    public country: string, 
    public url: string
  ) {}
};

(async () => {

  let newsData: News[] = [];

  // First API
  const url1: string = 'http://api.mediastack.com/v1/news';

  const params1: { access_key: string, keywords: string, countries: string, limit: number } = {
    access_key: 'private key',
    keywords: 'Brahman',
    countries: 'ar, br, co, us, mx, au',
    limit: 2
  };

  // GET to the first API
  try {
    const res = await axios.get(url1, {params: params1});

    // Receives the news and adds them into the list of News object
    const news: News[] = res.data.data.map(news => new News(
      news.title, news.description, news.date, news.country, news.url
    ));

    newsData.push(...news);

  } catch (err: any) {
    console.log(err);
  };

  // Second API
  const url2: string = 'https://newsdata.io/api/1/news';

  const params2: { apikey: string, q: string, country: string, size: number } = {
    apikey: 'private key',
    q: 'Brahman',
    country: 'us,ar,au,mx,br',
    size: 2
  };

  // GET to the second API
  try {
    const res = await axios.get(url2, {params: params2});

    // Receives the news and adds them into the list of News object
    const news: News[] = res.data.results.map(news => new News(
      news.title, news.description, news.pubDate, news.country[0], news.link
    ));

    newsData.push(...news);

  } catch (err: any) {
    console.log(err);
  };

  // Check if titles file exists, if not create one
  if (!fs.existsSync(titleFile)) {
    fs.writeFileSync(titleFile, '');
  };

  // Read title file
  const existingTitles: string[] = fs.readFileSync(titleFile, 'utf-8').split('\n').map(title => title.trim());

  // Filter and compare the data to avoid duplications
  const filteredData: News[] = newsData.filter((news: News) => {

    // If news already exists, filter it out
    if (existingTitles.includes(news.title)) {
      return false
      
    } else {
      // If news is not duplicated, return it and add the new to the file to avoid future duplications
      fs.appendFileSync(titleFile, `${news.title}\n`);
      return true
    };
  });

  // Finally if there exists news, send one mail per each news
  if (filteredData) {
    // Mail transporter
    const transporter = nodemailer.createTransport({
      host: 'smpt.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'mail',
        pass: 'password'
      }
    });

    // For each new, send them via mail
    filteredData.forEach(news => {
      const info = transporter.sendMail({
        from: 'mail',
        to: 'mail receptor',
        subject: `NEWS: ${news.title}`,
        text: `Description: ${news.description}
        \nDate: ${news.date}
        \nCountry: ${news.country}
        \nURL: ${news.url}`
      });
    });
  }

})();