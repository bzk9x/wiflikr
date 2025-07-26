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

const configPath = path.join(app.getPath('userData'), 'widget-config.json');
const isStartupLaunch = process.argv.includes('--startup');

function saveWidgetConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving widget config:', error);
    return false;
  }
}

function loadWidgetConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error loading widget config:', error);
  }
  return { widgets: [] };
}

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
    }
  });

  widgetWindow.loadFile('src/app/res/layout/widgets/square.html');
  return widgetWindow.id;
}

function createPortraitWidget() {
  const widgetWindow = new BrowserWindow({
    width: 100,
    height: 150,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  widgetWindow.loadFile('src/app/res/layout/widgets/portrait.html');
  return widgetWindow.id;
}

function createLandscapeWidget() {
  const widgetWindow = new BrowserWindow({
    width: 150,
    height: 100,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  widgetWindow.loadFile('src/app/res/layout/widgets/landscape.html');
  return widgetWindow.id;
}

function restoreWidgets() {
  const config = loadWidgetConfig();
  if (config && config.widgets) {
    config.widgets.forEach(widget => {
      switch (widget.type) {
        case 'square':
          createSquareWidget();
          break;
        case 'portrait':
          createPortraitWidget();
          break;
        case 'landscape':
          createLandscapeWidget();
          break;
      }
    });
  }
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

  ipcMain.handle('create-widget', async (event, type) => {
    let widgetId;
    switch (type) {
      case 'square':
        widgetId = createSquareWidget();
        break;
      case 'portrait':
        widgetId = createPortraitWidget();
        break;
      case 'landscape':
        widgetId = createLandscapeWidget();
        break;
      default:
        return { success: false, error: 'Invalid widget type' };
    }

    const config = loadWidgetConfig();
    config.widgets.push({ type, id: widgetId });
    saveWidgetConfig(config);

    return { success: true, id: widgetId };
  });

  ipcMain.handle('save-widget-config', async (event, config) => {
    return saveWidgetConfig(config);
  });

  // Only create the main window if this is not a startup launch
  if (!isStartupLaunch) {
    createWindow();
  }

  // Always restore widgets
  restoreWidgets();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && !isStartupLaunch) {
      createWindow();
    }
  });
});

// Modify the login item settings to include the startup flag
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe'),
  args: ['--startup']
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});