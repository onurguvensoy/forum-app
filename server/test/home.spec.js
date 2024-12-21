const { By, Builder, until } = require("selenium-webdriver");
const assert = require("assert");

function generateRandomEmail() {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${randomString}@example.com`;
}

function generateRandomUsername() {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${randomString}`;
}

function generateRandomPassword() {
    const randomLength = Math.floor(Math.random() * 5) + 8;
    return Math.random().toString(36).substring(2, randomLength + 2);
}

describe("Signup Page Test", function () {
    let driver;
    this.timeout(20000);

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function () {
        await driver.quit();
    });

    async function clearAndType(element, text) {
        await element.clear();
        await element.sendKeys(text);
    }

    it("should allow signup for a user", async function () {
        await driver.get("http://localhost:3000/signup");

        const randomEmail = await generateRandomEmail();
        const randomUsername = await generateRandomUsername();
        const randomPassword = await generateRandomPassword();

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));


        await clearAndType(emailInput, randomEmail);
        await clearAndType(usernameInput, randomUsername);
        await clearAndType(passwordInput, randomPassword);

        await driver.wait(until.elementIsEnabled(submitButton), 5000);
        await submitButton.click();


        await driver.wait(until.elementLocated(By.css(".Toastify__toast--success")), 10000);
        const successMessage = await driver.findElement(By.css(".Toastify__toast--success")).getText();
        assert(successMessage.includes("Signup successful"), "Success message should appear");


        await driver.wait(until.urlIs("http://localhost:3000/"), 5000);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, "http://localhost:3000/", "Should navigate to home page");
    });

    it("should not allow duplicate signup for the same user", async function () {
        await driver.get("http://localhost:3000/signup");

        const testEmail = "testuser@example.com"
        const testUsername = "testuser"
        const testPassword = "testpassword"

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));
       
        

        await driver.wait(until.elementIsEnabled(submitButton), 5000);
        await submitButton.click();

        // Wait for error message
        await driver.wait(until.elementLocated(By.css(".Toastify__toast--error")), 10000);
        const errorMessage = await driver.findElement(By.css(".Toastify__toast--error")).getText();
        assert(errorMessage.includes("User already exists"), "Error message should indicate duplicate user");
    });

    it("should show error for empty fields", async function () {
        await driver.get("http://localhost:3000/signup");

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));

        await clearAndType(emailInput, "");
        await clearAndType(usernameInput, "");
        await clearAndType(passwordInput, "");

        await driver.wait(until.elementIsEnabled(submitButton), 5000);
        await submitButton.click();

        // Wait for error message
        await driver.wait(until.elementLocated(By.css(".Toastify__toast--error")), 10000);
        const errorMessage = await driver.findElement(By.css(".Toastify__toast--error")).getText();
        assert(errorMessage.includes("Please fill all fields"), "Error message should appear");
    });
});
