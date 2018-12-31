// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// const { shell } = require('electron')
const webview = document.querySelector('webview')
const {ipcRenderer} = require('electron')

webview.addEventListener('new-window', (e) => {
  ipcRenderer.send('ipc-new-window', { url: e.url })

  // const url = require('url').parse(e.url)
  // const protocol = url.protocol
  // if (protocol === 'http:' || protocol === 'https:') {
  //   shell.openExternal(e.url)
  // }
})