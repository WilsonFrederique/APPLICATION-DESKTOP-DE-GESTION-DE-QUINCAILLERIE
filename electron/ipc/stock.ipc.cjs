const { ipcMain } = require("electron");
const stockService = require("../services/stock.service.cjs");

ipcMain.handle("stock:get", () => {
  return stockService.getAll();
});

ipcMain.handle("stock:add", (_, product) => {
  return stockService.add(product);
});

ipcMain.handle("stock:update", (_, id, updates) => {
  return stockService.update(id, updates);
});

ipcMain.handle("stock:delete", (_, id) => {
  return stockService.remove(id);
});