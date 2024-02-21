let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar")
const numerito = document.querySelector("#numerito");
const botonesTallas = document.querySelectorAll(".boton-tallas");

function cargarProductos(productosElegidos){

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto =>{
        
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img  class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">S/${producto.precio}</p>
                <p>Tallas 
                <button class="boton-tallas" data-id="${producto.id}" data-talla="40">40</button>
                <button class="boton-tallas" data-id="${producto.id}" data-talla="41">41</button>
                <button class="boton-tallas" data-id="${producto.id}" data-talla="42">42</button>
                <button class="boton-tallas" data-id="${producto.id}" data-talla="43">43</button>
                </p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `
        contenedorProductos.append(div);
        actualizarBotonesAgregar();
        actualizarBotonesTallas();
    })
}
cargarProductos(productos);

function actualizarBotonesTallas() {
    const botonesTallas = document.querySelectorAll(".boton-tallas");
    botonesTallas.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesTallas.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        });
    });
}

botonesCategorias.forEach(boton =>{
    boton.addEventListener("click",(e) => {
        
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if(e.currentTarget.id != "todos"){
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id)
            cargarProductos(productosBoton);    
        }else {
            tituloPrincipal.innerText = "Todos los productos"
            cargarProductos(productos);
        }
        
    })
})

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar")

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click",agregarAlCarrito);
    })
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if(productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
}else{
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    const tallaSeleccionada = document.querySelector(`.boton-tallas.active[data-id="${idBoton}"]`).dataset.talla;

    // Verificar si ya existe un producto con la misma talla seleccionada
    const productoExistente = productosEnCarrito.find(producto => producto.id === idBoton && producto.talla === tallaSeleccionada);

    if (productoExistente) {
        // Si el producto ya existe en el carrito con la misma talla, incrementar su cantidad
        productoExistente.cantidad++;
    } else {
        // Si el producto no existe en el carrito con la misma talla, agregarlo al carrito con la talla seleccionada
        const productoNuevo = { ...productoAgregado, cantidad: 1, talla: tallaSeleccionada };
        productosEnCarrito.push(productoNuevo);
    }

    // Actualizar la cantidad en el icono del carrito
    actualizarNumerito();
    // Actualizar los botones de agregar
    actualizarBotonesAgregar();
    // Actualizar y guardar el carrito en el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    Toastify({
        text: "Producto Agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            color: "black",
            background: "linear-gradient(to right, #fff, #fff)",
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
}

function actualizarNumerito(){
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto)=> acc + producto.cantidad, 0)
    numerito.innerHTML = nuevoNumerito
}

