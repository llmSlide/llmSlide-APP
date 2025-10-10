const path = require('path');
const builder = require('electron-builder');

let platform = process.platform;
let outputDir = 'electron-build';

if (platform === 'win32') {
    outputDir = 'electron-build/win';
} else if (platform === 'darwin') {
    outputDir = 'electron-build/macos';
}

let targets = [];
if (platform === 'win32') {
    targets = builder.Platform.WINDOWS.createTarget(['nsis', 'portable'], builder.Arch.x64);
} else if (platform === 'darwin') {
    targets = builder.Platform.MAC.createTarget(['dmg', 'zip'], builder.Arch.arm64);
}

builder.build({
    projectDir: path.resolve(__dirname),
    targets: targets,
    config: {
        'appId': 'llmSlide.svnet.uk',
        'productName': 'llmSlide',
        'copyright': 'Copyright © 2025 llmSlide',
        'directories': {
            'output': outputDir
        },
        'win': {
            'icon': path.resolve(__dirname, 'public/mocks/favicon.png'),
        },
        'mac': {
            'icon': path.resolve(__dirname, 'public/mocks/favicon.png'), 
        },
        'files': [
            'dist/**/*',
            '!dist/model/**/*',
            'main.js',
            '!**/.DS_Store',
            '!**/.*'
        ],
        'extraResources': [
            {
                "from": "dist/model",
                "to": "model"
            }
        ],
        'extends': null,
    }
}).then(
    (data) => console.log(data),
    (err) => console.error(err)
)