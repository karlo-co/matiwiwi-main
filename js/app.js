// Tienda de Productos Electrónicos
// Carga productos desde JSON, permitee elegir cantidades, calcula el total y valida formularios.

let productos = []; // Aquí guardamos todos los productos del JSON

// ---------- Funciones de ayuda ----------
function correoEsValido(correo) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

function mostrarError(idCampo, mensaje) {
  const span = document.getElementById("error-" + idCampo);
  if (span) span.textContent = mensaje;
}

function limpiarError(idCampo) {
  const span = document.getElementById("error-" + idCampo);
  if (span) span.textContent = "";
}

// Crea un campo oculto en el formulario (cada uno se ve como una fila en el correo)
function agregarCampoOculto(form, nombre, valor) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = nombre;
  input.value = valor;
  input.classList.add("boleta-item"); // marca para poder limpiarlos antes de reenviar
  form.appendChild(input);
}

// ---------- Cargar productos desde el JSON ----------
fetch("data/productos.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    productos = datos;
    mostrarProductos(datos);
  })
  .catch(error => {
    console.error("Error al cargar productos.json:", error);
  });

// ---------- Mostrar todos los productos ----------
function mostrarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");

  contenedor.innerHTML = lista.map(producto => `
    <div class="producto">
      <img class="producto-img" src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
      <label>Cantidad:
        <input type="number" class="cant-producto" data-id="${producto.id}"
               min="0" max="${producto.stock}" value="0">
      </label>
    </div>
  `).join("");

  // Cada vez que cambie una cantidad, recalculamos el resumen
  document.querySelectorAll(".cant-producto").forEach(input => {
    input.addEventListener("input", actualizarResumenCompra);
  });

  actualizarResumenCompra();
}

// ---------- Calcular la compra (subtotales + total) ----------
function calcularCompra() {
  let total = 0;
  let lineas = [];
  let stockExcedido = false;

  document.querySelectorAll(".cant-producto").forEach(input => {
    const cantidad = Number(input.value);
    const id = Number(input.dataset.id);
    const producto = productos.find(p => p.id === id);

    if (producto && cantidad > 0) {
      const subtotal = producto.precio * cantidad;
      total += subtotal;
      lineas.push(`${producto.nombre} x${cantidad} = $${subtotal}`);
      if (cantidad > producto.stock) stockExcedido = true;
    }
  });

  return { total, lineas, stockExcedido };
}

// ---------- Mostrar el resumen en pantalla y prepararlo para el correo ----------
function actualizarResumenCompra() {
  const { total, lineas } = calcularCompra();
  const resumen = document.getElementById("resumenCompra");
  const detalle = document.getElementById("detalleProducto");

  if (lineas.length === 0) {
    resumen.textContent = "Resumen de compra pendiente.";
    detalle.value = "";
    return;
  }

  const texto = lineas.join(" | ") + ` | TOTAL: $${total}`;
  resumen.textContent = texto;
  detalle.value = texto;
}

// ---------- Validación del formulario de COMPRA ----------
document.getElementById("formCompra").addEventListener("submit", function(event) {
  const nombre = document.getElementById("nombreCompra").value.trim();
  const correo = document.getElementById("correoCompra").value.trim();

  let hayError = false;

  limpiarError("nombreCompra");
  limpiarError("correoCompra");
  limpiarError("compra");

  if (nombre === "") {
    mostrarError("nombreCompra", "Debe ingresar su nombre.");
    hayError = true;
  }

  if (correo === "") {
    mostrarError("correoCompra", "Debe ingresar su correo.");
    hayError = true;
  } else if (!correoEsValido(correo)) {
    mostrarError("correoCompra", "El correo no tiene un formato válido.");
    hayError = true;
  }

  const { total, lineas, stockExcedido } = calcularCompra();

  if (lineas.length === 0) {
    mostrarError("compra", "Debe seleccionar al menos un producto.");
    hayError = true;
  }
  if (stockExcedido) {
    mostrarError("compra", "Una cantidad supera el stock disponible.");
    hayError = true;
  }

  // Si todo está bien, armamos la boleta con un campo por producto
  if (!hayError) {
    const form = this;

    // Limpiar campos de una boleta anterior (por si el usuario reenvía)
    form.querySelectorAll(".boleta-item").forEach(el => el.remove());

    // Fecha de la compra
    const fecha = new Date().toLocaleString("es-CL");
    agregarCampoOculto(form, "Fecha", fecha);

    // Un campo (fila) por cada producto seleccionado, con su detalle individual
    let numero = 1;
    document.querySelectorAll(".cant-producto").forEach(input => {
      const cantidad = Number(input.value);
      const id = Number(input.dataset.id);
      const producto = productos.find(p => p.id === id);

      if (producto && cantidad > 0) {
        const subtotal = producto.precio * cantidad;
        const detalle =
          `${producto.nombre} | Cantidad: ${cantidad} | ` +
          `Precio unitario: $${producto.precio} | Subtotal: $${subtotal}`;
        agregarCampoOculto(form, `Producto ${numero}`, detalle);
        numero++;
      }
    });

    // Total general como última fila
    agregarCampoOculto(form, "TOTAL", `$${total}`);
  }

  if (hayError) {
    event.preventDefault();
  }
});

// ---------- Validación del formulario de CONTACTO ----------
document.getElementById("formContacto").addEventListener("submit", function(event) {
  const nombre = document.getElementById("nombreContacto").value.trim();
  const correo = document.getElementById("correoContacto").value.trim();
  const asunto = document.getElementById("asuntoContacto").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  let hayError = false;

  limpiarError("nombreContacto");
  limpiarError("correoContacto");
  limpiarError("asuntoContacto");
  limpiarError("mensaje");

  if (nombre === "") {
    mostrarError("nombreContacto", "Debe ingresar su nombre.");
    hayError = true;
  }

  if (correo === "") {
    mostrarError("correoContacto", "Debe ingresar su correo.");
    hayError = true;
  } else if (!correoEsValido(correo)) {
    mostrarError("correoContacto", "El correo no tiene un formato válido.");
    hayError = true;
  }

  if (asunto === "") {
    mostrarError("asuntoContacto", "Debe ingresar un asunto.");
    hayError = true;
  }

  if (mensaje === "") {
    mostrarError("mensaje", "Debe escribir un mensaje.");
    hayError = true;
  } else if (mensaje.length < 10) {
    mostrarError("mensaje", "El mensaje debe tener al menos 10 caracteres.");
    hayError = true;
  }

  if (hayError) {
    event.preventDefault();
  }
});
