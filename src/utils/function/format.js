export function formatAr(amount) {
    return amount.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ar";
}

export function formatDate(d, detailed = false) {
    const config = { day: '2-digit', month: '2-digit', year: 'numeric' };
    if (detailed) {
        config.hour = '2-digit'
        config.minute = '2-digit'
    }
    return new Date(d).toLocaleDateString('fr-FR', config);
} 