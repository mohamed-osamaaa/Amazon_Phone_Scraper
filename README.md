# Amazon Phone Scraper

A Node.js web scraper that extracts phone product data from Amazon Egypt and saves it to a CSV file.

---

## Features

* Scrapes multiple pages of Amazon phone listings.
* Extracts detailed product information including:

  * Phone Name
  * List Price
  * Current Price
  * Brand Name
  * Operating System
  * RAM Memory Installed
  * About This Item
  * Product URL
* Handles network issues with retry logic.
* Saves the data to `phones.csv`.

---

## Requirements

* Node.js v18+ (ESM support)
* npm (Node Package Manager)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mohamed-osamaaa/Amazon_Phone_Scraper.git
cd Amazon_Phone_Scraper
```

2. Install dependencies:

```bash
npm install
```

---

## Usage

Run the scraper:

```bash
node index.js
```

* The scraped data will be saved automatically to `phones.csv`.
* Puppeteer runs in headless mode by default. Set `{ headless: false }` in `puppeteer.launch()` to see browser actions.

---

## Configuration

* `BASE_URL`: Amazon category URL to scrape.
* `MAX_PAGES`: Maximum number of pages for pagination to scrape (default is 5).
* `MAX_RETRIES`: Number of retries for failed page loads (default is 3).
* `TIMEOUT`: Timeout for page navigation in milliseconds (default is 30000).

---

## CSV Output

The output file `phones.csv` includes the following columns:

| Column Name          | Description                    |
| -------------------- | ------------------------------ |
| Phone Name           | Product name                   |
| List Price           | Original price before discount |
| Current Price        | Current selling price          |
| Brand Name           | Brand of the phone             |
| Operating System     | Phone OS                       |
| RAM Memory Installed | RAM size                       |
| About This Item      | Key features and description   |
| Product URL          | Link to the product page       |

---

## Notes

* The scraper uses retry logic for pages that fail to load due to network issues.
* Amazon page structure may change over time, so selectors might need updates.

---

## Dependencies

* [puppeteer](https://www.npmjs.com/package/puppeteer) – Browser automation.
* [csv-writer](https://www.npmjs.com/package/csv-writer) – CSV file creation.

