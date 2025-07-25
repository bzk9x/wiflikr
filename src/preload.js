const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getWallpaper: () => ipcRenderer.invoke('get-wallpaper'),
  createWidget: (type) => ipcRenderer.invoke('create-widget', type),
  saveWidgetConfig: (config) => ipcRenderer.invoke('save-widget-config', config)
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});