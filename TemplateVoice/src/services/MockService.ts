class MockService {
    static async sendMessage(message: string): Promise<string> {
        const responses = [
            "I'm a mock response 1!",
            "Mock response 2 coming through!",
            "Here's another mock response for you.",
            "Simulated response for testing purposes.",
        ];
        const randomIndex = Math.floor(Math.random() * responses.length);
        const randomDelay = Math.random() * 2000 + 1000; // Delay between 1 and 3 seconds

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(responses[randomIndex]);
            }, randomDelay);
        });
    }
}

export default MockService;
