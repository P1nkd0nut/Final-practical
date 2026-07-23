import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const SE_HUB = process.env.SELENIUM_HOST || 'http://localhost:4444/wd/hub';
const TARGET_URL = process.env.TEST_BASE_URL || 'http://localhost:8080';

async function runSeleniumTest() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    console.log("Connecting to Selenium Grid at:", SE_HUB);
    console.log("Targeting Web App at:", TARGET_URL);

    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer(SE_HUB)
        .setChromeOptions(options)
        .build();

    try {
        console.log("Navigating to target URL...");
        await driver.get(TARGET_URL);

        console.log("Finding search box...");
        let searchBox = await driver.wait(until.elementLocated(By.id('searchTerm')), 5000);
        
        console.log("Typing 'SeleniumSearch'...");
        await searchBox.sendKeys('SeleniumSearch');

        console.log("Submitting form...");
        let submitBtn = await driver.findElement(By.css('button[type="submit"]'));
        await submitBtn.click();

        console.log("Waiting for results...");
        await driver.wait(until.elementLocated(By.tagName('strong')), 5000);
        let result = await driver.findElement(By.tagName('strong')).getText();
        
        if (result === 'SeleniumSearch') {
            console.log("✅ UI Test Passed!");
        } else {
            console.error("❌ UI Test Failed. Expected 'SeleniumSearch', got: ", result);
            process.exit(1);
        }
    } catch (e) {
        console.error("❌ UI Test Errored:", e);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}

runSeleniumTest();
