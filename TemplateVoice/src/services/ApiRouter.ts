import MockService from './MockService';
import GeminiServiceClient from './GeminiServiceClient';
import ProxyService from './ProxyService';
import { API_SERVICE } from '@env';

class ApiRouter {
  static initialise() {
    if (API_SERVICE === 'PROXY') {
      ProxyService.initialiseConfig();
    }
    // Add other service initializations if needed
  }

  static async sendMessage(message: string): Promise<string> {
    console.log(API_SERVICE)
    switch (API_SERVICE) {
      case 'MOCK':
        return MockService.sendMessage(message);
      case 'GEMINI':
        return GeminiServiceClient.sendMessage(message);
      case 'PROXY':
        return ProxyService.sendMessage(message);
      default:
        throw new Error(`Invalid API_SERVICE: ${API_SERVICE}`);
    }
  }
}

export default ApiRouter;
