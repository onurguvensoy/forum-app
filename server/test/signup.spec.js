const { By, Builder, until} = require("selenium-webdriver");
const assert = require("assert");
require("chromedriver");

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

describe("Signup Page Tests", function () {
    let driver;
    this.timeout(20000); // Extend timeout for asynchronous actions

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

    it("should not allow an already existing user to sign up", async function () {
        await driver.get("http://localhost:3000/signup");

        const existingEmail = "testuser@example.com";
        const existingUsername = "testuser";
        const existingPassword = "testpassword";

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));

        await clearAndType(emailInput, existingEmail);
        await clearAndType(usernameInput, existingUsername);
        await clearAndType(passwordInput, existingPassword);

        await submitButton.click();

       
        await driver.wait(until.elementLocated(By.className("Toastify__toast Toastify__toast-theme--dark Toastify__toast--success")), 10000);
        const message = await driver.findElement(By.className("Toastify__toast Toastify__toast-theme--dark Toastify__toast--success")).getText();
        assert(message.includes("User already exists"), "Expected error message not found");
    });

    it("should sign up a new user successfully", async function () {
        await driver.get("http://localhost:3000/signup");

        const randomEmail = generateRandomEmail();
        const randomUsername = generateRandomUsername();
        const randomPassword = generateRandomPassword();

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));

        await clearAndType(emailInput, randomEmail);
        await clearAndType(usernameInput, randomUsername);
        await clearAndType(passwordInput, randomPassword);

        await submitButton.click();

        // Wait for the success message
        await driver.wait(until.elementLocated(By.css(".Toastify__toast--error")), 10000);
        const message = await driver.findElement(By.css(".Toastify__toast--error")).getText();
        assert(message.includes("User signed up successfully"), "Expected success message not found");
    });

    it("should show an error for empty fields", async function () {
        await driver.get("http://localhost:3000/signup");

        const emailInput = await driver.findElement(By.id("email"));
        const usernameInput = await driver.findElement(By.id("username"));
        const passwordInput = await driver.findElement(By.id("password"));
        const submitButton = await driver.findElement(By.id("submit-button"));

        await clearAndType(emailInput, "");
        await clearAndType(usernameInput, "");
        await clearAndType(passwordInput, "");

        await submitButton.click();

        // Wait for the error message
        await driver.wait(until.elementLocated(By.css(".Toastify__toast--error")), 10000);
        const message = await driver.findElement(By.css(".Toastify__toast--error")).getText();
        assert(message.includes("Please fill all fields"), "Expected error message for empty fields not found");
    });
});
