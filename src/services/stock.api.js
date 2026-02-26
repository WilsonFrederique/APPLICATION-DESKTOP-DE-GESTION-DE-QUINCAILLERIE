export const stockAPI = {
  getAll: async () => {
    try {
      return await window.api.getStocks();
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  },
  
  add: async (data) => {
    try {
      const result = await window.api.addStock(data);
      if (result.success) {
        // Notification
        if (window.api.showNotification) {
          window.api.showNotification('Stock mis à jour', `${data.name} ajouté avec succès!`);
        }
      }
      return result;
    } catch (error) {
      console.error('Erreur API:', error);
      return { success: false, error: error.message };
    }
  },
  
  update: async (id, updates) => {
    try {
      return await window.api.updateStock(id, updates);
    } catch (error) {
      console.error('Erreur API:', error);
      return { success: false, error: error.message };
    }
  },
  
  delete: async (id) => {
    try {
      return await window.api.deleteStock(id);
    } catch (error) {
      console.error('Erreur API:', error);
      return { success: false, error: error.message };
    }
  }
};