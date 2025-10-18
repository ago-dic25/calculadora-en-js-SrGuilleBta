// Variables globales
let logOperaciones = [];

// Elementos del DOM
const numero1Input = document.getElementById('numero1');
const numero2Input = document.getElementById('numero2');
const sumarBtn = document.getElementById('sumar');
const restarBtn = document.getElementById('restar');
const multiplicarBtn = document.getElementById('multiplicar');
const dividirBtn = document.getElementById('dividir');
const resultadoDiv = document.getElementById('resultado');
const logDiv = document.getElementById('log');

// Función para validar campos
function validarCampos() {
    if (numero1Input.value === '' || numero2Input.value === '') {
        mostrarError('Por favor, completa ambos campos');
        return false;
    }
    
    // Validar que sean números válidos
    const numero1 = parseFloat(numero1Input.value);
    const numero2 = parseFloat(numero2Input.value);
    
    if (isNaN(numero1) || isNaN(numero2)) {
        mostrarError('Por favor, ingresa números válidos');
        return false;
    }
    
    return true;
}

// Función para mostrar error
function mostrarError(mensaje) {
    resultadoDiv.innerHTML = `<p class="error">${mensaje}</p>`;
}

// Función para mostrar resultado
function mostrarResultado(resultado) {
    resultadoDiv.innerHTML = `<p class="success">Resultado: ${resultado}</p>`;
}

// Función para agregar al log
function agregarAlLog(operacion, numero1, numero2, resultado, esError = false) {
    const simboloOperacion = obtenerSimboloOperacion(operacion);
    
    const logItem = {
        operacion: simboloOperacion,
        numero1,
        numero2,
        resultado,
        esError
    };
    
    logOperaciones.unshift(logItem); // Agregar al inicio del array
    
    // Limitar el log a las últimas 10 operaciones
    if (logOperaciones.length > 10) {
        logOperaciones = logOperaciones.slice(0, 10);
    }
    
    actualizarLog();
}

// Función para obtener el símbolo de la operación
function obtenerSimboloOperacion(operacion) {
    switch(operacion) {
        case 'sumar': return '+';
        case 'restar': return '-';
        case 'multiplicar': return '×';
        case 'dividir': return '÷';
        default: return operacion;
    }
}

// Función para actualizar el log en la interfaz
function actualizarLog() {
    if (logOperaciones.length === 0) {
        logDiv.innerHTML = '<p>Aquí se mostrarán las operaciones anteriores</p>';
        return;
    }
    
    let html = '';
    logOperaciones.forEach(item => {
        const clase = item.esError ? 'error' : '';
        html += `
            <div class="log-item ${clase}">
                ${item.numero1} ${item.operacion} ${item.numero2} = ${item.resultado}
            </div>
        `;
    });
    
    logDiv.innerHTML = html;
}

// Función para realizar operaciones
function realizarOperacion(tipoOperacion) {
    if (!validarCampos()) return;
    
    const numero1 = parseFloat(numero1Input.value);
    const numero2 = parseFloat(numero2Input.value);
    let resultado;
    let operacionExitosa = true;
    
    switch(tipoOperacion) {
        case 'sumar':
            resultado = numero1 + numero2;
            break;
        case 'restar':
            resultado = numero1 - numero2;
            break;
        case 'multiplicar':
            resultado = numero1 * numero2;
            break;
        case 'dividir':
            if (numero2 === 0) {
                mostrarError('Error: No se puede dividir entre cero');
                agregarAlLog('dividir', numero1, numero2, 'Error: División entre cero', true);
                operacionExitosa = false;
                return;
            }
            resultado = numero1 / numero2;
            break;
        default:
            return;
    }
    
    if (operacionExitosa) {
        // Redondear resultado a 2 decimales si es necesario
        resultado = Math.round(resultado * 100) / 100;
        
        mostrarResultado(resultado);
        agregarAlLog(tipoOperacion, numero1, numero2, resultado, false);
    }
}

// Event Listeners
sumarBtn.addEventListener('click', () => realizarOperacion('sumar'));
restarBtn.addEventListener('click', () => realizarOperacion('restar'));
multiplicarBtn.addEventListener('click', () => realizarOperacion('multiplicar'));
dividirBtn.addEventListener('click', () => realizarOperacion('dividir'));

// Permitir usar el teclado para realizar operaciones
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        realizarOperacion('sumar');
    }
});

// Inicializar el log
actualizarLog();