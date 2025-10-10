const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loadModel: (modelPath) => ipcRenderer.invoke('model-load', modelPath),
    chat: (userMessage) => ipcRenderer.invoke('model-chat', userMessage),
    chatStream: (userMessage) => ipcRenderer.invoke('model-chat-stream', userMessage),
    onChatStreamChunk: (callback) => ipcRenderer.on('model-chat-stream-chunk', (_event, chunk) => callback(chunk)),
    generateSlides: (outline, language) => ipcRenderer.invoke('model-grenerate-slides', outline, language),
    ocrPDF: (filepath) => ipcRenderer.invoke('get-pdf-text', filepath),
    showModelList: () => ipcRenderer.invoke('show-model-list'),
    getModelDirPath: () => ipcRenderer.invoke('get-model-path'),
    openFolder: (path) => ipcRenderer.invoke('open-folder', path),
    unloadModel: () => ipcRenderer.invoke('model-unload'),
    selectFile: () => ipcRenderer.invoke('select-file'),
});