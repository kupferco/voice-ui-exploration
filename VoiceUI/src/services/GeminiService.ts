class GeminiService {
    static async sendMessage(message: string): Promise<string> {
        const apiKey = 'your-gemini-api-key'; // Replace with your Gemini API key
        const url = 'https://api.gemini.com/v1/chat'; // Replace with the correct Gemini API endpoint

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.reply || 'No response from Gemini API';
    }
}

export default GeminiService;
