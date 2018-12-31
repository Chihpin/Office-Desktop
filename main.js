// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

// todo: ?ui=en-US&rs=US&auth=1
let ops_home = { title: 'Office', url: 'https://www.office.com/?ui=en-US&rs=US&auth=1' }
let ops_word = { title: 'Word', url: 'https://office.live.com/start/Word.aspx' }

let allowURL = [ops_home, ops_word]


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = []


function createWindow(ops) {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1000, 
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    darkTheme: true,
    titleBarStyle: 'hidden',
    useContentSize: true,
    vibrancy: 'ultra-dark',
    webPreferences: {
      nativeWindowOpen: true,
    }
  })
  mainWindow.push(win)
  // Open the DevTools.
  // win.webContents.openDevTools()


  if (ops == null || ops.url == null) {    
    if (ops == null) ops = ops_home
    if (ops.url == null) ops.url = ops_home.url

    // win.loadFile('index.html')
    console.log(`file://${__dirname}/index.html?title=${ops.title||'Office'}&url=${ops.url||ops_home.url}`)
    win.loadURL(`file://${__dirname}/index.html?title=${ops.title||'Office'}&url=${ops.url||ops_home.url}`)
    // win.loadFile('index.html?title=' + ops.title||'Office'+ '&url=', ops.url)
  } else {
    let url = URL(ops.url)
    if (url.protocol === 'http:' || url.protocol === 'https:' ) {
      win.loadFile('index.html?title=' + ops.title + '&url=' + ops.url)
    } else if (urlstring == null || urlstring.length == 0) {    
      win.loadFile(ops.url + '?title=' + ops.title)
    }
  }
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



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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

const { shell } = require('electron')

ipcMain.on('ipc-new-window', (event, args) => {
  let toURL = URL(args.url)
  for (var i=0; i<allowURL.length; i++) {
    let alow = element[i]
    if (toURL.host === URL(alow.url).host) {
      createWindow(alow)
      return
    }
  }

  if (toURL.protocol === 'http:' || toURL.protocol === 'https:') {
    shell.openExternal(args.url)
  }
})