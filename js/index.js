const divPerifericos = document.getElementById("divPerifericos")
const tablaCarrito = document.getElementById("tablaCarrito")
const totalCarrito = document.getElementById("totalCarrito")
let botonComprar = document.getElementById("comprar");

function solicitarUsuario() {
    Swal.fire({
      title: "Bienvenido a Perifericos Center",
      input: "text",
      inputPlaceholder: "Por favor, ingresa tu nombre",
      confirmButtonText: "Aceptar",
      background: '#88b4a0',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return "Ingresa tu nombre!!!!";
        }
      },
    }).then((result) => {
      const usuario = result.value;
      console.log(usuario);
      Swal.fire({
        title: `¡Perfecto ${usuario}!`,
        text: "Estas en el lugar indicado ~",
        icon: "success",
        background: '#88b4a0',
      });
      Swal.fire({
        title: `${usuario}!`,
        text: "Necesitas un adulto responsable que te ayude a concretar la compra",
        icon: "warning",
        confirmButtonText: "Aceptar",
        background: '#b1dccb',
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: `${usuario}!`,
            text: '¿Qué edad tenés?',
            input: 'number',
            inputAttributes: {
              min: 1
            },
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            background: '#b1dccb',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              const edad = result.value;
              console.log(edad);
              if (edad >= 18) {
                Swal.fire({
                  title: `¡Perfecto ${usuario}!`,
                  text: 'Estás en el lugar indicado ~',
                  icon: 'success',
                  background: '#88b4a0',
                });
              } else {
                Swal.fire({
                  title: `${usuario}!`,
                  text: 'Necesitas un adulto responsable que te ayude a concretar la compra',
                  icon: 'warning',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false,
                }).then(() => {
                  solicitarUsuario();
                });
              }
            }
          });
        }
      });
    });
  }

document.addEventListener('DOMContentLoaded', () => {
    if (document.title === "PERIFÉRICOS CENTER") {
        solicitarUsuario();
    }
    mostrarCarrito()
    mostrarTotalCarrito()
    mostrarProductos(perifericos);
});

function mostrarProductos(perifericos){
    divPerifericos.innerHTML=""
    perifericos.forEach(perifericos => {
        divPerifericos.innerHTML+=`
        <div class="card mb-4" style="width: 18rem;">
            <img src="${perifericos.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${perifericos.marca} ${perifericos.modelo}</h5>
                <p class="card-text">$ ${perifericos.precio}</p>
                <button onclick="agregarAlCarrito(${perifericos.id})" class="btn btn-success"> Comprar </button>
            </div>
        </div>
        `
    });
}

// carrito

function mostrarCarrito() {
    let carrito = capturarStorage()
    tablaCarrito.innerHTML=""
    carrito.forEach(element => {
        tablaCarrito.innerHTML+= `
        <tr>
            <td data-th="Product">
                <div class="row">
                <div class="col-sm-2 hidden-xs"><img src="${element.img}" width=50px alt="..."/></div>
                    <div class="col-sm-10">
                        <h5 class="nomargin">${element.marca} ${element.modelo}</h5><h6>${element.color}</h6>
                    </div>
                </div>
            </td>
            <td data-th="Precio">${element.precio}</td>
            <td data-th="Cantidad">
                <div class="column d-flex align-items-center">
                    <button class="btn btn-success btn-sm" onclick="restarCant(${element.id})"><i class="fa-solid fa-square-minus"></i></button>
                    <p class="form-control text-center mb-0">${element.cantidad}</p>
                    <button class="btn btn-success btn-sm" onclick="incrementarCant(${element.id})"><i class="fa fa-plus-square"></i></button>
                </div>
            </td>
            <td data-th="Subtotal" class="text-center">${element.precio * element.cantidad}</td>
            <td><button onclick="eliminarProductoCarrito(${element.id})" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></button></td>
        </tr>
        `
    });
}

function capturarStorage(){
    return JSON.parse(localStorage.getItem("carrito")) || []
}

// Guardar los productos del carrito
function guardarStorage(array){
    localStorage.setItem("carrito", JSON.stringify(array))
}

function agregarAlCarrito(id) {
    let carrito = capturarStorage()
    if (estaEnCarrito(id)){
        incrementarCant(id)
    } else {
        let productoEncontrado = perifericos.find(perifericos=>perifericos.id==id)
        carrito.push({...productoEncontrado, cantidad: 1})
        guardarStorage(carrito)
        mostrarCarrito()
    }
    mostrarCarrito()
    console.log(carrito)
    mostrarTotalCarrito()
}

function incrementarCant(id) {
    let carrito = capturarStorage()
    const indice = carrito.findIndex(perifericos => perifericos.id==id)
    carrito[indice].cantidad++
    guardarStorage(carrito)
    mostrarCarrito()
    mostrarTotalCarrito()
}

function restarCant(id) {
    let carrito = capturarStorage();
    const index = carrito.findIndex((e) => e.id == id); 
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--; 
      guardarStorage(carrito);
      mostrarCarrito();
      mostrarTotalCarrito();
    } else {
      carrito = confirm(`deseas eliminar ${carrito[index].marca} ${carrito[index].modelo} del carrito de compras`) && eliminarProductoCarrito(id);
    }
  }

function estaEnCarrito(id){
    let carrito = capturarStorage()
    return carrito.some(e=>e.id==id)
}

function eliminarProductoCarrito(id) {
    let carrito = capturarStorage()
    let resultado = carrito.filter(perifericos => perifericos.id != id)
    guardarStorage(resultado)
    console.log(resultado)
    mostrarCarrito()
    mostrarTotalCarrito()
}

// calculo el valor total
function mostrarTotalCarrito() {
    const carrito = capturarStorage();
    const total = carrito.reduce(
      (acc, element) => acc + element.cantidad * element.precio,0
    );
    totalCarrito.textContent = `$ ${total}`; // Actualiza el valor en la página HTML
    return total; // Se devuelve el valor total
  }
// Al finalizar la compra
function finalizarCompra() {
  let carrito = capturarStorage();
  let total = mostrarTotalCarrito(); // Se obtiene el valor total
  
  // Se pregunta al usuario si desea realizar la compra
  if (total === 0) {
    alert("El carrito está vacío");
  } else {
    if (confirm(`¿Está seguro que desea realizar la compra por un total de $${total}?`)) {
      alert("Serás redirigido para finalizar tu compra");

      carrito = [];
      guardarStorage(carrito);
      
      // Redirigir al usuario a la página de checkout
      window.location.href = "./pages/cart.html"; // URL de la página a la que quieres redirigir al usuario
    }
  }
}

// Completando formulario
const formulario = document.querySelector('form');

formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita que la página se recargue al enviar el formulario
  
  const nombreapellido = document.querySelector('#nombreapellido').value;
  const dni = document.querySelector('#dni').value;
  const cel = document.querySelector('#cel').value;
  const correo = document.querySelector('#inputCorreo').value;
  const direccion = document.querySelector('#direccion').value;
  const ciudad = document.querySelector('#ciudad').value;
  const cp = document.querySelector('#cp').value;
    
  console.log('Nombre y apellido:', nombreapellido);
  console.log('DNI:', dni);
  console.log('Teléfono:', cel);
  console.log('Correo electrónico:', correo);
  console.log('Dirección:', direccion);
  console.log('Ciudad:', ciudad);
  console.log('Código postal:', cp);
});
