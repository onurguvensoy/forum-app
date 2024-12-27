const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Signup Test', function() {
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should sign up a new user', async function() {
    await driver.get('http://localhost:3000/signup');
    driver.sleep(2000);

    // Fill out the signup form
    await driver.findElement(By.name('username')).sendKeys('testuser');
    await driver.findElement(By.name('email')).sendKeys('testuser@example.com');
    await driver.findElement(By.name('password')).sendKeys('TestPassword123!');
    await driver.findElement(By.name('confirmPassword')).sendKeys('TestPassword123!');
    await driver.findElement(By.name('phoneNumber')).sendKeys('1234567890');

    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Wait for the success message
    await driver.wait(until.elementLocated(By.css('.Toastify__toast--success')), 10000);

    // Assert that the success message is displayed
    const successMessage = await driver.findElement(By.css('.Toastify__toast--success')).getText();
    assert.strictEqual(successMessage, 'Account created successfully! Redirecting...');

    // Optionally, you can also check if the user is redirected to the home page
    await driver.wait(until.urlIs('http://localhost:3000/'), 10000);
  });
});