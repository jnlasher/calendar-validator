const renderer = require('electron').ipcRenderer;

function openWindow(dom_element) {
    renderer.send('loadGH', 'https://www.google.com/device');
    document.getElementById(dom_element).innerHTML = "Continue";
}