class ProxyService {
    static async sendMessage(message: string): Promise<string> {
        const url = 'https://your-proxy-server.com/api/chat'; // Replace with your proxy server URL

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Proxy Server Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.reply || 'No response from Proxy Server';
    }
}

export default ProxyService;
