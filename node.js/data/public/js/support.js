document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;
  
    addMessage('You', message);
    input.value = '';
  
    try {
      const response = await fetch('http://192.168.3.6:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "YOUR_MODEL_NAME",
          messages: [{ role: "user", content: message }]
        })
      });
  
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No reply received.';
      addMessage('Assistant', reply);
    } catch (error) {
      console.error('Error:', error);
      addMessage('Assistant', 'Error connecting to the server.');
    }
  });
  
  function addMessage(sender, text) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  