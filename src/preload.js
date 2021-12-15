const {
    contextBridge,
    ipcRenderer, 
    Menu, 
    desktopCapturer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["show-context-menu"];
            if (validChannels.includes(channel)) {
                console.log("SEND: ", channel, data);
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["context-menu-command"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, func) => {
            let validChannels = ["desktopCapturer"];
            if (validChannels.includes(channel)) {
                ipcRenderer.invoke(channel, (...args) => func(...args));
            }
        },
        // getInputSources: async () => await desktopCapturer.getSources({
        //     types: ['window', 'screen']
        // }),
        // buildMenu: (inputSources) => {
        //     console.log("INPUT SOURCES", inputSources);
        //     console.log("MENU", Menu);
        //     Menu.buildFromTemplate(inputSources.map(source => {
        //         return {
        //             label: source.name,
        //             click: () => console.log(source)
        //         };
        //     }));
        // },
    }
);

