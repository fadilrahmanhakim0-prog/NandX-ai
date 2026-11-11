// Ganti bagian fungsi sendMessage di script index.html dengan ini:
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || isGenerating) return;

    // Masukkan pesan user ke UI
    addMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    isGenerating = true;
    sendBtn.disabled = true;
    const typingElement = showTypingIndicator();

    try:
        // Mengirimkan riwayat chat ke backend main.py
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: chatHistory })
        });

        const data = await response.json();
        removeTypingIndicator(typingElement);

        if (response.ok && data.reply) {
            addMessage(data.reply, 'assistant');
            chatHistory.push({ role: 'assistant', content: data.reply });
        } else {
            addMessage(` Error: ${data.error || 'Gagal mendapat respon dari AI.'}`, 'assistant');
        }
    } catch (err) {
        removeTypingIndicator(typingElement);
        addMessage(' Error: Tidak dapat terhubung ke server Python.', 'assistant');
    } finally {
        isGenerating = false;
        sendBtn.disabled = false;
    }
}