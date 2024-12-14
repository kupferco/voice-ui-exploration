class MockService {
    static async sendMessage(message: string): Promise<string> {
        const responses = [
            "I'm a mock response 1!",
            "Mock response 2 coming through!",
            "Here's another mock response for you.",
            "Simulated response for testing purposes.",
        ];
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
}

export default MockService;
