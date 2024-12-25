const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

(async function chatAutomation() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        console.log('Launching browser and navigating to login page...');
        await driver.get('http://localhost:3000/login');
        
        await driver.sleep(2000);

        const testmail = "ooo@gmail.com";
        const testusername = "ooo";
        const password = 'ooo';

        console.log('Filling in login credentials...');
        await driver.wait(until.elementLocated(By.id('email')), 10000);
        let emailInput = await driver.findElement(By.id('email'));
        await emailInput.sendKeys(testmail);

        await driver.sleep(1000);

        await driver.wait(until.elementLocated(By.id('password')), 10000);
        let passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys(password);

        console.log('Submitting login form...');
        let submitButton = await driver.wait(until.elementLocated(By.id('login-button')), 10000);
        await submitButton.click();

        await driver.sleep(1000);

        console.log('Verifying login success...');
        await driver.wait(until.elementLocated(By.className("success-toast")), 5000);
        assert(await driver.findElement(By.className("success-toast")).isDisplayed(), 'Login success message should appear');
        console.log('Logged in successfully!');

        console.log('Navigating to community chat...');
        await driver.get('http://localhost:3000/communitychat');
        await driver.sleep(2000);

        console.log('Sending a chat message...');
        await driver.wait(until.elementLocated(By.css('.chat-container')), 10000);
        let inputField = await driver.findElement(By.css('.chat-input input'));
        let chatmessage = "Hello, this is an automated test message!";
        await inputField.sendKeys(chatmessage);

        let sendButton = await driver.findElement(By.css('.chat-input button'));
        await sendButton.click();

        await driver.sleep(1000);

        console.log('Verifying the sent message...');
        await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${chatmessage}"]`)), 10000);
        let sentMessage = await driver.findElement(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${chatmessage}"]`));
        let text = await sentMessage.getText();

        assert.strictEqual(text, chatmessage, `Expected message "${chatmessage}" but found "${text}".`);
        console.log('Test passed! The message was sent correctly.');

  
        console.log('Testing empty message handling...');
        await sendButton.click();
        console.log('Verifying that no empty message is added...');
        let emptyMessageCheck = await driver.findElements(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()=""]`));
        assert.strictEqual(emptyMessageCheck.length, 0, 'Empty messages should not be allowed.');


        console.log('Testing character limit...');
        let longMessage = 'a'.repeat(101);
        await inputField.sendKeys(longMessage);
        await sendButton.click();
        console.log('Verifying message character limit enforcement...');
        let limitedMessageCheck = await driver.findElements(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${longMessage}"]`));
        assert.strictEqual(limitedMessageCheck.length, 0, 'Messages exceeding character limit should not be sent.');
        await driver.sleep(1000);
        console.log('Testing word filtering...');
        let offensiveMessage = 'This is a badword test!';
        let expectedFilteredMessage = '******'; 

        try {
            await inputField.clear();
            await inputField.sendKeys(offensiveMessage);
            await sendButton.click();

            await driver.wait(
                until.elementLocated(By.xpath(`//div[contains(@class, 'chat-messages')]//p[contains(text(), "****")]`)),
                10000
            );

            let filteredMessageElement = await driver.findElement(
                By.xpath(`//div[contains(@class, 'chat-messages')]//p[contains(text(), "****")]`)
            );
            let filteredText = await filteredMessageElement.getText();

            console.log("Filtered message from the app:", filteredText);
            assert.strictEqual(
                filteredText,
                expectedFilteredMessage,
                `Expected "${expectedFilteredMessage}" but found "${filteredText}".`
            );
            console.log('Word filter test passed!');
        } catch (error) {
            console.error('Word filter test failed!', error);
        }

        
       console.log('Testing username display for the last message...');
        await driver.sleep(1000); 


        let lastMessageUsernameElement = await driver.findElement(
            By.xpath(`(//div[contains(@class, 'chat-messages')]//span[contains(@class, 'timestamp')]//strong)[last()]`)
        );


        const lastDisplayedUsername = await lastMessageUsernameElement.getText();


        console.log(`Last message's username: ${lastDisplayedUsername}`);
        assert.strictEqual(lastDisplayedUsername, testusername, 'The username of the last message should match the logged-in user.');
        await driver.sleep(1000);

        
        console.log('Testing timestamp for the last message...');
        await driver.sleep(1000); 


        let lastTimestampElement = await driver.findElement(
            By.xpath(`(//div[contains(@class, 'chat-messages')]//span[contains(@class, 'timestamp')])[last()]`)
        );


        let lastTimestampText = await lastTimestampElement.getText();


        console.log(`Last message's timestamp: ${lastTimestampText}`);
        assert(lastTimestampText.includes('•'), 'Timestamp format should include a separator (e.g., "•").');
        console.log('Last message timestamp verified:', lastTimestampText);

        await driver.sleep(1000);
            
                console.log('Testing chat persistence...');
                let persistentMessage = 'This message should persist after refresh.';
                await inputField.clear();
                await inputField.sendKeys(persistentMessage);
                await sendButton.click();
                await driver.navigate().refresh();
                await driver.sleep(2000);
                let persistentMessageElement = await driver.findElement(By.xpath(`//div[contains(@class, 'chat-messages')]//p[text()="${persistentMessage}"]`));
                let persistentText = await persistentMessageElement.getText();
                assert.strictEqual(persistentText, persistentMessage, 'Message should persist after page refresh.');

            } catch (error) {
                console.error('Test failed!', error);
            } finally {
                console.log('Quitting the browser...');
                await driver.quit();
            }
        })();
