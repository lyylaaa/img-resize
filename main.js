const path = require('path');
const {app, BrowserWindow, Menu} = require('electron');

const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV !== 'development';

function createMainWindows(){
    const mainWindow = new BrowserWindow({
            title: 'Image Rezier',
            width: isDev ? 1000 : 500,
            height: 600,
            webPreferences:{
                contextIsolation: true,
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            }
        }
    );

    //open devtools if in dev env
    if(isDev){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 300,
        height: 300
    }
);

aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));

}

app.whenReady().then(() => {
    createMainWindows()
    const mainMenu= Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){ createMainWindows() }
    });
});


const menu = [
   ...(isMac? [{
    label: app.name,
    submenu: [
        {
            label: 'About',
            click: createAboutWindow,
        }
    ]
   }] : []), 
   {
    role: 'fileMenu'
   },
   ...(!isMac ? [{
        label: 'Help',
        submenu:[{
            label: 'About',
            click: createAboutWindow,
        }]
   }] : [])
]


app.on('window-all-closed', () => {
    if(!isMac) { app.quit(); }
});