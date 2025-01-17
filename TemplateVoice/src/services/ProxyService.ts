import { Config, GeminiService, SessionManager } from 'proxy-assistant-sdk';

class ProxyService {
    private static geminiService = new GeminiService();

    // Ensure the configuration is initialized
    static initialiseConfig() {
        Config.setApiBaseUrl(Config.getApiBaseUrl());
        SessionManager.initializeSession();
    }

    static async sendMessage(message: string): Promise<string> {
        try {
            // Ensure session is initialized
            const sessionId = SessionManager.getSessionId();
            console.log(sessionId)

            // Use the GeminiService to send the message
            const response = await this.geminiService.sendRestMessage(sessionId, message);

            // Return the assistant's reply
            return response || 'No response from Gemini Service';
        } catch (error) {
            console.error('Error in ProxyService sendMessage:', error);
            throw new Error('Failed to send message through Gemini Service.');
        }
    }
}

export default ProxyService;
