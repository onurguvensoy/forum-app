import React from 'react'

const Chat = () => {
  return (
    <div class="chat-container">
  <div class="chat-header">
    <h3>Community Chat</h3>
  </div>
  <div class="chat-messages">
    <div class="message received">
      <p>Hello! How's it going?</p>
      <span class="timestamp">10:30 AM</span>
    </div>
    <div class="message sent">
      <p>I'm doing great, thank you! What about you?</p>
      <span class="timestamp">10:32 AM</span>
    </div>
  </div>
  <div class="chat-input">
    <input type="text" placeholder="Type your message..." />
    <button>Send</button>
  </div>
</div>
  )
}

export default Chat