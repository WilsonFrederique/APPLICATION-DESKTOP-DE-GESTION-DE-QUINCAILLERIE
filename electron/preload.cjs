const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getStocks: () => ipcRenderer.invoke('stock:get'),
  addStock: (data) => ipcRenderer.invoke('stock:add', data),
  updateStock: (id, updates) => ipcRenderer.invoke('stock:update', id, updates),
  deleteStock: (id) => ipcRenderer.invoke('stock:delete', id),
});