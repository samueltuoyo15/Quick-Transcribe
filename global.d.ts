declare interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

declare class SpeechRecognition {
  onresult: (event: SpeechRecognitionEvent) => void;
  start(): void;
  stop(): void;
}
