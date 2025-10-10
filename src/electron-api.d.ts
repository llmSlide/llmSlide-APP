interface ElectronAPI {
    loadModel: (modelPath: string) => Promise<any>;
    chat: (userMessage: string) => Promise<any>;
    chatStream: (userMessage: string) => Promise<void>;
    onChatStreamChunk: (callback: (chunk: string) => void) => void;
    generateSlides: (outline: string, language: string) => Promise<string>;
    ocrPDF: (filepath: string) => Promise<string>;
    showModelList: () => Promise<string[]>;
    getModelDirPath: () => Promise<string>;
    openFolder: (path: string) => Promise<void>;
    unloadModel: () => Promise<void>;
    selectFile: () => Promise<string | null>;
}

interface Window {
    electronAPI: ElectronAPI;
}