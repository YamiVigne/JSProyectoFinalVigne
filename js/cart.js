const carrito = localStorage.getItem('carrito');
const total = localStorage.getItem('total');

function capturarStorage(){
    return JSON.parse(localStorage.getItem("carrito")) || []
}

// Mostrar los datos en la página
document.getElementById('carrito').textContent = perifericos;
document.getElementById('total').textContent = total;