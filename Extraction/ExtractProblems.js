const fs = require('fs');
const parser = require('csv-parse');
const puppeteer = require('puppeteer');

// Read the CSV file
fs.readFile('contests.csv', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse CSV data
  parser.parse(data, (err, records) => {
    if (err) {
      console.error(err);
      return;
    }

    // Define an array to store the JSON data
    const jsonData = [];

    // Launch Puppeteer browser
    (async () => {
      const browser = await puppeteer.launch();

      // Iterate through each row
      for (let i =0;i<records.length;i++) {
        const record = records[i];
        const url = record[1]; // Accessing the second column by index

        // Open page and execute code
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the element to be available
        await page.waitForSelector('.list-group.hover-panel.contest-question-list');

        // Extract contest name and link
        const contestName = record[0];
        const contestLink = url;

        // Extract problem names and links
        const extractedData = await page.evaluate(() => {
          const Questions = document.querySelector('.list-group.hover-panel.contest-question-list');
          const QuestionsList = Questions.querySelectorAll('a');

          return Array.from(QuestionsList).map(question => ({
            name: question.innerHTML.trim(),
            href: question.getAttribute('href')
          }));
        });
        console.log(jsonData.length);

        // Construct JSON object
        const contestJson = {
          ContestName: contestName,
          ContestLink: "https://www.leetcode.com" + contestLink,
          Problems: extractedData
        };

        // Push JSON object to the array
        jsonData.push(contestJson);

        await page.close();
      }

      // Write JSON data to a file
      fs.writeFile('output.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('JSON data has been written to output.json');
      });

      // Close the browser
      await browser.close();
    })();
  });
});
