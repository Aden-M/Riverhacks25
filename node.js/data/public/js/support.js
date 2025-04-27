document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage('You', message);
    input.value = '';

    try {
        const response = await fetch('/api/support', { // ✅ LOCAL BACKEND, NOT direct to 192.168.3.6
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message }) // ✅ Only sending { message }, backend handles LM Studio stuff
        });

        if (!response.ok) throw new Error('Server error');

        const data = await response.json();
        const reply = data.reply || 'No reply received.';
        addMessage('Assistant', reply);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Assistant', '❌ Error connecting to support server.');
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
