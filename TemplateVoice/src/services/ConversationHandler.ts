import ApiRouter from './ApiRouter'; // Add this import

type Message = {
    id: string;
    type: 'user' | 'agent';
    text: string;
};

class ConversationHandler {
    private static instance: ConversationHandler;
    private messages: Message[] = [];
    private listeners: Array<(messages: Message[]) => void> = [];

    private constructor() {
        // Initialize the ApiRouter when the handler is first created
        ApiRouter.initialise();
    }


    // Singleton Instance
    public static getInstance(): ConversationHandler {
        if (!ConversationHandler.instance) {
            ConversationHandler.instance = new ConversationHandler();
        }
        return ConversationHandler.instance;
    }

    // Add Message and Notify Listeners
    private addMessage(message: Message) {
        this.messages.push(message);
        // console.log('Current Messages:', this.messages); // Debugging line
        this.notifyListeners();
    }


    // Send Message to API and Add Responses
    public async sendMessage(input: string): Promise<string> {
        const userMessage: Message = { id: Date.now().toString(), type: 'user', text: input };
        this.addMessage(userMessage);
    
        try {
            const response = await ApiRouter.sendMessage(input); // Fetch response
            const agentMessage: Message = { id: Date.now().toString(), type: 'agent', text: response };
            this.addMessage(agentMessage);
    
            return response; // Return the agent's response as a string
        } catch (error) {
            const errorMessage = 'Error: Could not process the request.';
            const agentMessage: Message = { id: Date.now().toString(), type: 'agent', text: errorMessage };
            this.addMessage(agentMessage);
    
            return errorMessage; // Return the error message as a string
        }
    }
    

    // Get All Messages
    public getMessages(): Message[] {
        return this.messages;
    }

    // Subscribe to Updates
    public subscribe(callback: (messages: Message[]) => void) {
        this.listeners.push(callback);
    }

    // Unsubscribe
    public unsubscribe(callback: (messages: Message[]) => void) {
        this.listeners = this.listeners.filter((listener) => listener !== callback);
    }

    private notifyListeners() {
        // console.log('Notifying Listeners with:', this.messages); // Debugging line
        this.listeners.forEach((callback) => callback(this.messages));
    }

}

export default ConversationHandler.getInstance();
