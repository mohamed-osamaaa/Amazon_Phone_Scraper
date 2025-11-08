import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from 'puppeteer';

const BASE_URL = "https://www.amazon.eg/-/en/s?i=electronics&rh=n%3A21832883031&s=popularity-rank&fs=true&language=en&qid=1762578514&xpid=b4uF2OEAeCBT_&ref=sr_pg_1";

const csvWriter = createObjectCsvWriter({
    path: "phones.csv",
    header: [
        { id: "name", title: "Phone Name" },
        { id: "listPrice", title: "List Price" },
        { id: "currentPrice", title: "Current Price" },
        { id: "brandName", title: "Brand Name" },
        { id: "operatingSystem", title: "Operating System" },
        { id: "ram", title: "RAM Memory Installed" },
        { id: "about", title: "About This Item" },
        { id: "url", title: "Product URL" },
    ],
});


async function scrapeAmazon() {
    const browser = await puppeteer.launch({ headless: true }); // Set headless to false to see the browser actions
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle2" });

    const results = [];

    let hasNextPage = true;

    while (hasNextPage) {
        console.log("Scraping new page...");
        const productLinks = await page.$$eval(
            "div.a-section.a-spacing-base a.a-link-normal.s-no-outline",
            (links) => links.map((a) => a.href).filter((href) => href.includes("/dp/"))
        );
        for (const url of productLinks) {
            try {
                await page.goto(url, { waitUntil: "domcontentloaded" });

                const data = await page.evaluate(() => {
                    const name =
                        document.querySelector("#title")?.innerText?.trim() ||
                        "N/A";

                    const listPriceElement = document.querySelector('.a-text-price .a-offscreen');
                    let listPrice = "N/A";
                    if (listPriceElement) {
                        listPrice = listPriceElement.innerText.replace('List Price:', '').replace('EGP', '').replace(/\.00$/, '').trim();
                    }

                    const currentPriceElement = document.querySelector('span.a-price.aok-align-center.reinventPricePriceToPayMargin');
                    let currentPrice = "N/A";
                    if (currentPriceElement) {
                        currentPrice = currentPriceElement.querySelector('.a-price-whole')?.firstChild?.nodeValue?.trim();
                    }

                    let brandName = "N/A";
                    let operatingSystem = "N/A";
                    let ram = "N/A";

                    const allListItems = document.querySelectorAll('tr');

                    allListItems.forEach(item => {
                        const text = item.innerText || item.textContent || '';

                        if (text.includes('Brand') && brandName === "N/A") {
                            const spans = item.querySelectorAll('span');
                            for (let i = 0; i < spans.length; i++) {
                                const spanText = spans[i].innerText?.trim();
                                if (spanText && !spanText.includes('Brand') && !spanText.includes('Name') && spanText.length > 0 && spanText.length < 50) {
                                    brandName = spanText;
                                    break;
                                }
                            }
                        }

                        if (text.includes('Operating System') && operatingSystem === "N/A") {
                            const spans = item.querySelectorAll('span');
                            for (let i = 0; i < spans.length; i++) {
                                const spanText = spans[i].innerText?.trim();
                                if (spanText && !spanText.includes('Operating') && !spanText.includes('System') && spanText.length > 0 && spanText.length < 50) {
                                    operatingSystem = spanText;
                                    break;
                                }
                            }
                        }

                        if (text.includes('RAM') && ram === "N/A") {
                            const spans = item.querySelectorAll('span');
                            for (let i = 0; i < spans.length; i++) {
                                const spanText = spans[i].innerText?.trim();
                                if (spanText && !spanText.includes('RAM') && !spanText.includes('Memory') && spanText.match(/\d+\s*(GB|MB)/i)) {
                                    ram = spanText;
                                    break;
                                }
                            }
                        }
                    });

                    const aboutList = Array.from(
                        document.querySelectorAll("#feature-bullets li span.a-list-item")
                    ).map(span => span.innerText.trim());

                    return { name, listPrice, currentPrice, brandName, operatingSystem, ram, about: aboutList.join(" | ") };
                });

                results.push({ ...data, url });
                console.log(`Done: ${data.name}`);
            } catch (err) {
                console.log(`Error scraping product: ${url}`);
            }
            // To Scrap one product for testing
            hasNextPage = false;
            break;

            // await page.goto(BASE_URL, { waitUntil: "networkidle2" });

            // const nextButton = await page.$("a.s-pagination-item.s-pagination-next:not([aria-disabled])");
            // if (nextButton) {
            //     await Promise.all([
            //         page.click("a.s-pagination-item.s-pagination-next"),
            //         page.waitForNavigation({ waitUntil: "networkidle2" }),
            //     ]);
            // } else {
            //     hasNextPage = false;
            // }
        }
    }
    await csvWriter.writeRecords(results);
    console.log("Saved to phones.csv");

    await browser.close();
}

scrapeAmazon();