import { STTService, TTSWebSocketService, GeminiService, SessionManager, ConversationService } from 'proxy-assistant-sdk';

class VoiceService {
    private sttService: STTService;
    private ttsService: TTSWebSocketService;
    private geminiService: GeminiService;
    private isMuted: boolean;

    constructor() {
        this.sttService = new STTService();
        this.ttsService = new TTSWebSocketService();
        this.geminiService = new GeminiService();
        this.isMuted = false;

        // Initialize session and connect TTS WebSocket
        SessionManager.initializeSession();
        this.ttsService.connect();
        this.geminiService.connect();
    }

    async fetchConversationHistory(): Promise<{ role: string; text: string }[]> {
        return await ConversationService.fetchHistory();
    }

    async clearConversationHistory(): Promise<void> {
        await ConversationService.clearHistory();
    }

    async startListening(onSpeechResult: (transcript: string) => void): Promise<void> {
        await this.sttService.startListening(onSpeechResult);
    }

    stopListening(): void {
        this.sttService.stopListening();
    }

    mute(): void {
        this.sttService.stopSendingAudio();
        this.isMuted = true;
    }

    unmute(): void {
        this.sttService.startSendingAudio();
        this.isMuted = false;
    }

    interruptAudio(): void {
        this.ttsService.interruptAudio();
    }

    playTTS(blob: Blob): Promise<void> {
        // Leverage the TTSService's playAudio method
        return this.ttsService.playAudio(blob);
    }

}

export default new VoiceService();
