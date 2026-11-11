from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from groq import Groq
import os

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("GROQ_API_KEY", "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")
client = Groq(api_key=api_key)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        messages = data.get('messages', [])

        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)