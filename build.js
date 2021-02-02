const path = require('path');
const builder = require('electron-builder');

builder.build({
    projectDir: path.resolve(__dirname),

    win: ['nsis', 'portable'], 
    config: {
        "appId": "com.cilent.app.electronbuild",
        "productName": "trace spending",
        "directories": { "output": "build" },
        "win": { "icon": path.resolve(__dirname, 'icon.png') },
        "mac": { "icon": path.resolve(__dirname, 'icon.png') },
    },
})
  .then(
      data => console.log(data),
      err => console.error(err)
  )