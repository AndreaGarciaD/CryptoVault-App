export const getTipoForDisplay = (tipo) => {

    switch (tipo) {
        case 1:
            return 'Ingreso';
        case 2:
            return 'Egreso';
        default:
            return 'No definido';
    }
}

export const cubrirNumeroTarjeta = (numero) => {
    // Verificar que el número de tarjeta sea una cadena y tenga al menos 4 caracteres
    if (typeof numero !== 'string' || numero.length < 4) {
        throw new Error('El número de tarjeta debe ser una cadena con al menos 4 caracteres.');
    }

    // Mantener solo los últimos 4 dígitos visibles
    const lastFourDigits = numero.slice(-4);

    // Cubrir los primeros dígitos con 'x'
    const coveredDigits = 'X'.repeat(numero.length - 4);

    // Combinar los dígitos cubiertos con los últimos 4 dígitos visibles
    return `${coveredDigits}${lastFourDigits}`;
}