const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

(async function chatAutomation() { 
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        console.log('Launching browser and navigating to login page...');
        await driver.get('http://localhost:3000/login');
        
        // Sleep to slow down and observe the browser
        await driver.sleep(2000);  // Wait for 2 seconds

        const testmail = "ooo@gmail.com";
        const password = 'ooo';

        console.log('Filling in login credentials...');
   
        await driver.wait(until.elementLocated(By.id('email')), 10000);
        let emailInput = await driver.findElement(By.id('email'));
        await emailInput.sendKeys(testmail);

        await driver.sleep(1000); // Sleep for 1 second

        await driver.wait(until.elementLocated(By.id('password')), 10000);
        let passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys(password);

        console.log('Submitting login form...');
        let submitButton = await driver.wait(until.elementLocated(By.id('login-button')), 10000);
        await submitButton.click();

        await driver.sleep(1000); // Sleep for 1 second

        console.log('Verifying login success...');
        await driver.wait(until.elementLocated(By.className("success-toast")), 5000);
        await assert(driver.findElement(By.className("success-toast")).isDisplayed(), 'Login success message should appear');

        console.log('Navigating to community chat...');
        await driver.get('http://localhost:3000/communitychat');

        await driver.sleep(2000);  // Sleep for 2 seconds

        console.log('Sending a chat message...');
        await driver.wait(until.elementLocated(By.css('.chat-container')), 10000);
        let inputField = await driver.findElement(By.css('.chat-input input'));
        let chatmessage = "Hello, this is an automated test message!";
        await inputField.sendKeys(chatmessage);

        let sendButton = await driver.findElement(By.css('.chat-input button'));
        await sendButton.click();

        await driver.sleep(1000); // Sleep for 1 second

        console.log('Verifying the sent message...');
        await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${chatmessage}"]`)), 10000);
        let sentMessage = await driver.findElement(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${chatmessage}"]`));
        let text = await sentMessage.getText();

        assert.strictEqual(text, chatmessage, `Expected message "${chatmessage}" but found "${text}".`);

        console.log('Test passed! The message was sent correctly.');

    } catch (error) {
        console.error('Test failed!', error);
    } finally {
        console.log('Quitting the browser...');
        await driver.quit();
    }
})();
