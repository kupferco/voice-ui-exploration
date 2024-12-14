import { GOOGLE_API_KEY } from '@env';

type ChatEntry = {
  role: 'system' | 'user' | 'assistant';
  text: string;
};

class GeminiService {
  private static conversationHistory: ChatEntry[] = [
    {
      role: 'system',
      text: `You are a helpful and concise AI assistant. Your responses should be short, informative, and avoid unnecessary details.`,
    },
  ];

  /**
   * Send a user message to the Gemini API and get a response.
   * @param userText The user's input message.
   * @returns The assistant's response as a string.
   */
  static async sendMessage(userText: string): Promise<string> {
    // Add the user's message to the conversation history
    this.conversationHistory.push({ role: 'user', text: userText });

    // Prepare the payload for the Gemini API
    const payload = {
      contents: [
        {
          parts: [
            {
              text: this.conversationHistory.map((entry) => `${entry.role}: ${entry.text}`).join('\n'),
            },
          ],
        },
      ],
    };

    try {
      // Send the request to the Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Add the AI's response to the conversation history
        this.conversationHistory.push({ role: 'assistant', text: aiResponse });

        return aiResponse; // Return the AI response
      } else {
        console.error('No valid response from Gemini API:', data);
        return 'Sorry, I could not understand your request.';
      }
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      return 'Error: Unable to connect to Gemini API.';
    }
  }

  /**
   * Get the complete conversation history.
   * Useful for debugging or displaying past interactions.
   */
  static getHistory(): ChatEntry[] {
    return this.conversationHistory;
  }

  /**
   * Clear the conversation history and reset to the initial prompt.
   */
  static clearHistory(): void {
    this.conversationHistory = [
      {
        role: 'system',
        text: `You are a helpful and concise AI assistant. Your responses should be short, informative, and avoid unnecessary details.`,
      },
    ];
  }
}

export default GeminiService;
