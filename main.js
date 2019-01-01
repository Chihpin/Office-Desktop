// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, shell, Menu, Tray} = require('electron')
const {autoUpdater} = require("electron-updater")

global.Buffer = global.Buffer || require('buffer').Buffer;
if (typeof btoa === 'undefined') {
  global.btoa = function(str) { return new Buffer(str).toString('base64') }
}
if (typeof atob === 'undefined') {
  global.atob = function(str) { return Buffer.from(str, 'base64').toString() }
}




let lang = "en-US";//zh-CN

// const path = require('path')

// todo: ?ui=en-US&rs=US&auth=1
let ops_home = { title: 'Office', url: 'https://www.office.com/?ui='+lang+'&auth=1' }

let allowURL = [ops_home,
  { title: 'Outlook', url: 'https://outlook.com/' },
  { title: 'Onedrive', url: 'https://onedrive.live.com/' },
  { title: 'Word', url: 'https://office.live.com/start/Word.aspx' },
  { title: 'Excel', url: 'https://office.live.com/start/Excel.aspx?omkt='+lang+'&auth=1' }, // https://office.live.com/start/Excel.aspx?omkt=zh-CN&auth=1
  { title: 'PowerPoint', url: 'https://office.live.com/start/PowerPoint.aspx?omkt='+lang+'&auth=1' }, // https://office.live.com/start/PowerPoint.aspx?omkt=zh-CN&auth=1
  { title: 'OneNote', url: 'https://www.onenote.com/notebooks?auth=1' }, //https://www.onenote.com/notebooks?auth=1
  { title: 'Skype', url: 'https://web.skype.com/?source=owa' }, // https://web.skype.com/?source=owa
  { title: 'Calendar', url: 'https://calendar.live.com/calendar/calendar.aspx' }, // https://calendar.live.com/calendar/calendar.aspx
  { title: 'People', url: 'https://sway.office.com/'},
  { title: 'Sway', url: 'https://sway.office.com/'}
]

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let tray = null
let trayWindow = null
var mainWindow = []


// let tray = null
// app.on('ready', () => {
//   tray = new Tray('./build/icons/icon_16x16@2x.png')
//   const contextMenu = Menu.buildFromTemplate([
//     { label: 'Item1', type: 'radio' },
//     { label: 'Item2', type: 'radio' },
//     { label: 'Item3', type: 'radio', checked: true },
//     { label: 'Item4', type: 'radio' }
//   ])
//   tray.setToolTip('This is my application.')
//   tray.setContextMenu(contextMenu)
// })

function showTrayWindow() {
  const position = getWindowPosition()
  trayWindow.setPosition(position.x, position.y, false)
  trayWindow.show()
  trayWindow.focus()
}

const createTray = () => {
  trayWindow = createWindow(ops_home, true)

  const toggleTrayWindow = () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide()
    } else {
      showTrayWindow()
    }
  }

  tray = new Tray(`${__dirname}/build/icons/icon_16x16@2x.png`)
  tray.on('right-click', toggleTrayWindow)
  tray.on('double-click', toggleTrayWindow)
  tray.on('click', function (event) {
    toggleTrayWindow()

    // Show devtools when command clicked
    if (trayWindow.isVisible() && process.defaultApp && event.metaKey) {
      trayWindow.openDevTools({mode: 'detach'})
    }
  })
  

  const getWindowPosition = () => {
    const windowBounds = trayWindow.getBounds()
    const trayBounds = tray.getBounds()
  
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)
  
    return {x: x, y: y}
  }
}





function createWindow(ops, isTrayWindow = false) {

  let big = (ops != null && ops.url !== ops_home.url)

  // Create the browser window.
  let win = new BrowserWindow({
    width: isTrayWindow ? 320 : (big ? 1400 : 1000), 
    height: isTrayWindow ? 540 : (big ? 1000 : 700), 
    minWidth: isTrayWindow ? 320 : (big ? 1400 : 1000), 
    minHeight: isTrayWindow ? 540 : (big ? 1000 : 700), 
    frame: false,
    titleBarStyle: 'hidden',
    useContentSize: true,
    

    darkTheme: !isTrayWindow,
    minimizable: !isTrayWindow,
    maximizable: !isTrayWindow,
    closable: !isTrayWindow,
    alwaysOnTop: isTrayWindow,
    movable: !isTrayWindow,
    resizable: !isTrayWindow,
    fullscreenable: !isTrayWindow,  
    transparent: isTrayWindow,
    webPreferences: {
      nativeWindowOpen: true,
      backgroundThrottling: false,
    }
  })
  if (!isTrayWindow) {
    win.setVibrancy('ultra-dark')
  }

  if (isTrayWindow) {
    // Hide the window when it loses focus
    win.on('blur', () => {
      if (!win.webContents.isDevToolsOpened()) {
        win.hide()
      }
    })
  }
  mainWindow.push(win)
  // Open the DevTools.
  // win.webContents.openDevTools()


  if (ops == null) ops = ops_home    
  if (ops.title == null) ops.title = ops_home.title
  if (ops.url == null) ops.url = ops_home.url

  
  console.log(ops)
  console.log(`file://${__dirname}/index.html?title=${btoa(ops.title)}&url=${btoa(ops.url)}&tray=${isTrayWindow ? 1 : 0}`)
  win.loadURL(`file://${__dirname}/index.html?title=${btoa(ops.title)}&url=${btoa(ops.url)}&tray=${isTrayWindow ? 1 : 0}`)

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow.pop(win)
  })

  win.once('ready-to-show', () => {
    win.show()
  })
  return win
}

// ipcMain.on('show-window', () => {
//   showTrayWindow()
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  // createWindow()
  autoUpdater.checkForUpdatesAndNotify();
  // createTray()
  if (global.enabelTrayMode) {
    createTray()
  } else {
    createWindow()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow.length === 0) {
    // console.log(mainWindow)
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('ipc-new-window', (event, args) => {
  let toURL = new URL(args.url)
  for (var i=0; i<allowURL.length; i++) {
    let alow = allowURL[i]
    let url = new URL(alow.url)
    if (toURL.host === url.host) {
      createWindow(alow)
      return
    }
  }
  if (toURL.hostname.includes('docs.live.net')) {
    createWindow( { title: 'Onedrive', url: args.url } )
    return
  }
  if (toURL.protocol === 'http:' || toURL.protocol === 'https:') {
    shell.openExternal(args.url)
  }
})