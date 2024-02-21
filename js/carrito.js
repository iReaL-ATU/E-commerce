let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar")
const contenedorTotal = document.querySelector("#total")
const botonComprar = document.querySelector("#carrito-acciones-comprar")

function cargarProductosCarrito(){

    if (productosEnCarrito && productosEnCarrito.length > 0){

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto =>{
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Titulo</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-titulo">
                <small>Talla</small>
                <h3>${producto.talla}</h3>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>S/${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>S/${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i>
            </button>
            `
            contenedorCarritoProductos.append(div);
        })
    
    }else{
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
    actualizarBotonesEliminar()
    actualizarTotal()
}

cargarProductosCarrito();

function actualizarBotonesEliminar(){
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar")

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click",eliminarDelCarrito);
    })
}

function eliminarDelCarrito(e){

    Toastify({
        text: "Producto Eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #13141a, #13141a)",
          borderRadius :"1rem",
          textTransform: "uppercase",
          fontSize: ".85rem"
        },
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
    
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1)
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))

}

botonVaciar.addEventListener("click", vaciarCarrito)
function vaciarCarrito(){
    Swal.fire({
        title: "¿Estás Seguro?",
        icon: "question",
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad,0)} productos`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Sí`,
        cancelButtonText: `No`,
        cancelButtonAriaLabel: "Thumbs down"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
            cargarProductosCarrito();
        }
      });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc,producto) => acc + (producto.precio * producto.cantidad), 0)

    total.innerHTML = `S/${totalCalculado }`;
}

botonComprar.addEventListener("click", comprarCarrito)
function comprarCarrito() {
    // Guardar la lista de productos en un array
    const listaProductos = [...productosEnCarrito];

    // Limpiar el carrito
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Actualizar la interfaz de usuario
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

    // Enviar la lista de productos por WhatsApp
    enviarMensajeWhatsApp(listaProductos);
}
function enviarMensajeWhatsApp(listaProductos) {
    // Crear el mensaje con la lista de productos
    let mensaje = "Lista de productos:\n";
    let total = 0; // Inicializar el total en 0
    listaProductos.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal; // Sumar el subtotal al total
        mensaje += `Título: ${producto.titulo}, Talla: ${producto.talla}, Cantidad: ${producto.cantidad}, SubTotal = ${subtotal}\n`;
    });
    mensaje += `Total: ${total}`; // Agregar el total al mensaje

    // Codificar el mensaje para usarlo en el enlace
    mensaje = encodeURIComponent(mensaje);

    // Generar el enlace de WhatsApp con el mensaje
    const enlaceWhatsApp = `https://wa.me/939104255?text=${mensaje}`;

    // Abrir el enlace en una nueva ventana
    window.open(enlaceWhatsApp);
}
