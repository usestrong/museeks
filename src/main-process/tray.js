'use strict';

const os = require('os');

const { Tray, Menu, app, ipcMain } = require('electron');

class IpcManager {

    constructor(win, icon) {

        this.tray = null;
        this.trayIcon = icon;
        this.win = win;
        this.contextMenu;
    }

    bindEvents() {

        ipcMain.on('showTray', () => {

            this.show();
        });

        ipcMain.on('hideTray', () => {

            this.hide();
        });

        ipcMain.on('playerAction', (event, reply) => {

            switch(reply) {
                case 'play':
                    this.contextMenu.items[0].visible = false;
                    this.contextMenu.items[1].visible = true;
                    break;
                case 'pause':
                    this.contextMenu.items[0].visible = true;
                    this.contextMenu.items[1].visible = false;
                    break;
            }
        });
    }

    show() {

        this.tray = new Tray(this.trayIcon);

        this.contextMenu = Menu.buildFromTemplate([
            {
                label: 'Play',
                click: () => {
                    this.win.webContents.send('playerAction', 'play');
                }
            },
            {
                label: 'Pause',
                visible: false,
                click: () => {
                    this.win.webContents.send('playerAction', 'pause');
                }
            },
            {
                label: 'Previous',
                click: () => {
                    this.win.webContents.send('playerAction', 'prev');
                }
            },
            {
                label: 'Next',
                click: () => {
                    this.win.webContents.send('playerAction', 'next');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Show',
                click: () => {
                    this.win.show();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                click: () => {
                    this.win.destroy();
                    app.quit();
                }
            }
        ]);

        this.tray.setToolTip('Museeks');
        this.tray.setTitle('Museeks');

        if(os.platform() === 'win32') {
            this.tray.on('click', () => {
                this.win.show();
                this.hide();
            });
        } else { // Darwin or Linux
            this.tray.on('double-click', () => {
                this.win.show();
                this.hide();
            });
        }

        this.tray.setContextMenu(this.contextMenu);
    }

    hide() {

        this.tray.destroy();
    }
}

module.exports = IpcManager;
