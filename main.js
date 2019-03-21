const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { shell } = require('electron');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1280, height: 800});
  win.loadURL(`file://${__dirname}/dist/calendar-validator/index.html`);

  // Uncomment below to open the DevTools.
  win.webContents.openDevTools();

  // Event when the window is closed.
  win.on('closed', _ => {
    win = null;
  });
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', _ => {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', _ => {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});

// Load dependency for external links
ipcMain.on('loadGH', (_, arg) => {
  shell.openExternal(arg);
});