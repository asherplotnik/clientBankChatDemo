class ChatApiService {
  constructor() {
    this.responses = [
      "Thank you for your message. I'm here to help you with your banking needs.",
      "I understand your question. Let me provide you with the information you need.",
      "That's a great question! Based on your inquiry, here's what I can tell you.",
      "I appreciate you reaching out. Here's the information regarding your request.",
      "Thank you for contacting us. I'd be happy to assist you with that.",
      "I've received your message and I'm processing your request. Here's my response.",
      "Thanks for getting in touch! I can help you with that banking question.",
      "I understand what you're asking about. Let me provide you with a helpful response.",
      "Thank you for your inquiry. I'm here to assist you with your banking needs.",
      "I've reviewed your message and I'm ready to help. Here's what I can tell you."
    ]
  }

  /**
   * Simulates an API call and returns a random response
   * @param {string} message - The user's message
   * @param {string} username - The username
   * @param {string} customerId - The customer ID
   * @returns {Promise<Object>} - A promise that resolves to an object with a message property
   */
  async sendMessage(message, username, customerId) {
    // Simulate network delay (500ms - 1500ms)
    const delay = Math.floor(Math.random() * 1000) + 500
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get a random response from the array
        const randomIndex = Math.floor(Math.random() * this.responses.length)
        const response = this.responses[randomIndex]
        
        resolve({
          message: response,
          username: username,
          customer_id: customerId
        })
      }, delay)
    })
  }
}

export default ChatApiService

