const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  execSync
} = require('child_process');

function getWallpaperPath() {
  try {
    if (process.platform === 'win32') {
      const powershellPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
      const powershellCommand = `(Get-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name Wallpaper).Wallpaper`;
      const wallpaperPath = execSync(`"${powershellPath}" -command "${powershellCommand}"`).toString().trim();
      return wallpaperPath;
    } else if (process.platform === 'darwin') {
      const script = 'tell application "System Events" to get picture of current desktop';
      const wallpaperPath = execSync(`osascript -e '${script}'`).toString().trim();
      return wallpaperPath;
    } else {
      console.error('Unsupported platform');
      return null;
    }
  } catch (error) {
    console.error('Error getting wallpaper path:', error);
    return null;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  win.loadFile('src/app/res/layout/layout_wiflikr.html');
}

function createSquareWidget() {
  const widgetWindow = new BrowserWindow({
    width: 100,
    height: 100,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  widgetWindow.loadFile('src/app/res/layout/widgets/square.html');
}

app.whenReady().then(() => {
  ipcMain.handle('get-wallpaper', async () => {
    const wallpaperPath = getWallpaperPath();
    if (wallpaperPath && fs.existsSync(wallpaperPath)) {
      try {
        const wallpaperData = fs.readFileSync(wallpaperPath);
        const base64Data = wallpaperData.toString('base64');
        const mimeType = path.extname(wallpaperPath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
        return `data:${mimeType};base64,${base64Data}`;
      } catch (error) {
        console.error('Error reading wallpaper file:', error);
        return null;
      }
    }
    return null;
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});