const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Login and Chat Application Tests", function () {
  let driver;
  this.timeout(30000); // Extend timeout for test cases

  const testCredentials = {
    email: "testuser@example.com",
    password: "testpassword123",
  };

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/login");
  });

  after(async function () {
    await driver.quit();
  });

  const login = async () => {
    // Wait for the login form
    await driver.wait(until.elementLocated(By.id("email")), 5000);

    // Fill out the login form
    const emailInput = await driver.findElement(By.id("email"));
    const passwordInput = await driver.findElement(By.id("password"));
    const loginButton = await driver.findElement(By.id("login-button"));

    await emailInput.sendKeys(testCredentials.email);
    await passwordInput.sendKeys(testCredentials.password);
    await loginButton.click();

    // Wait for navigation to chat page
    await driver.wait(until.urlIs("http://localhost:3000/chat"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, "http://localhost:3000/chat", "User should be redirected to the chat page after login");
  };

  it("should log in successfully", async function () {
    await login();
  });

  it("should load chat messages", async function () {
    await login();

    // Wait for the chat header to load
    await driver.wait(until.elementLocated(By.css(".chat-header")), 5000);

    const chatHeader = await driver.findElement(By.css(".chat-header")).getText();
    assert.strictEqual(chatHeader, "Community Chat", "Chat header should display correctly");

    // Check if messages container loads
    const messagesContainer = await driver.findElement(By.css(".chat-messages"));
    assert(messagesContainer, "Chat messages container should exist");

    // Check if messages are displayed or show 'No messages yet'
    const noMessagesText = "No messages yet. Be the first to start the conversation!";
    const messages = await driver.findElements(By.css(".message"));
    if (messages.length > 0) {
      const firstMessage = await messages[0].getText();
      assert(firstMessage, "Messages should be displayed in the chat");
    } else {
      const noMessages = await messagesContainer.getText();
      assert.strictEqual(noMessages, noMessagesText, "No messages text should be displayed");
    }
  });

  it("should send a new message", async function () {
    await login();

    const testMessage = `Hello, this is a test message ${Date.now()}`;
    const inputField = await driver.findElement(By.css(".chat-input input"));
    const sendButton = await driver.findElement(By.css(".chat-input button"));

    // Type and send the message
    await inputField.sendKeys(testMessage);
    await sendButton.click();

    // Wait for the new message to appear
    await driver.wait(until.elementLocated(By.css(".message.sent")), 5000);

    const sentMessages = await driver.findElements(By.css(".message.sent"));
    const lastMessage = sentMessages[sentMessages.length - 1];
    const lastMessageText = await lastMessage.findElement(By.css("p")).getText();

    assert.strictEqual(lastMessageText, testMessage, "The last sent message should match the input message");
  });

  it("should display username and timestamp for sent messages", async function () {
    await login();

    const sentMessages = await driver.findElements(By.css(".message.sent"));
    const lastMessage = sentMessages[sentMessages.length - 1];

    const timestampMetadata = await lastMessage.findElement(By.css(".timestamp")).getText();
    assert(
      timestampMetadata.includes(" • "),
      "Username and timestamp should be displayed for sent messages"
    );
  });

  it("should handle errors for empty messages", async function () {
    await login();

    const inputField = await driver.findElement(By.css(".chat-input input"));
    const sendButton = await driver.findElement(By.css(".chat-input button"));

    // Try sending an empty message
    await inputField.clear();
    await sendButton.click();

    // Wait for error toast
    await driver.wait(until.elementLocated(By.css(".chat-error")), 5000);

    const errorText = await driver.findElement(By.css(".chat-error")).getText();
    assert.strictEqual(errorText, "Message could not be sent. Please try again.", "Error should appear for empty messages");
  });
});
