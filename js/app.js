// Archivo base para estudiantes.
// Objetivo: cargar productos desde JSON, mostrar un producto y validar formularios de forma básica.

let productoEjemplo = null;

function correoEsValido(correo) {
  // Comprueba formato básico: algo@algo.dominio
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

function mostrarError(idCampo, mensaje) {
  // Muestra el mensaje en un <span> ubicado junto al campo (id="error-XXX")
  const span = document.getElementById("error-" + idCampo);
  if (span) span.textContent = mensaje;
}

function limpiarError(idCampo) {
  const span = document.getElementById("error-" + idCampo);
  if (span) span.textContent = "";
}

fetch("data/productos.json")
  .then(respuesta => respuesta.json())
  .then(datos => {
    productoEjemplo = datos[0];
    mostrarProducto(productoEjemplo);
  })
  .catch(error => {
    console.error("Error al cargar productos.json:", error);
  });

function mostrarProducto(producto) {
  const contenedor = document.getElementById("contenedor-productos");

  contenedor.innerHTML = `
    <div class="producto">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
    </div>
  `;

  actualizarResumenCompra();
}

function actualizarResumenCompra() {
  if (productoEjemplo === null) {
    return;
  }

  const cantidad = Number(document.getElementById("cantidad").value);
  const total = productoEjemplo.precio * cantidad;

  document.getElementById("resumenCompra").textContent =
    `Producto: ${productoEjemplo.nombre} | Cantidad: ${cantidad} | Total: $${total}`;

  document.getElementById("detalleProducto").value =
    `Producto: ${productoEjemplo.nombre} | Cantidad: ${cantidad} | Total: $${total}`;
}

document.getElementById("cantidad").addEventListener("input", actualizarResumenCompra);

document.getElementById("formCompra").addEventListener("submit", function(event) {
  const nombre = document.getElementById("nombreCompra").value.trim();
  const correo = document.getElementById("correoCompra").value.trim();
  const cantidad = Number(document.getElementById("cantidad").value);

  let hayError = false;

  // Limpiar errores previos
  limpiarError("nombreCompra");
  limpiarError("correoCompra");
  limpiarError("cantidad");

  // Validar nombre
  if (nombre === "") {
    mostrarError("nombreCompra", "Debe ingresar su nombre.");
    hayError = true;
  }

  // Validar correo (formato real)
  if (correo === "") {
    mostrarError("correoCompra", "Debe ingresar su correo.");
    hayError = true;
  } else if (!correoEsValido(correo)) {
    mostrarError("correoCompra", "El correo no tiene un formato válido.");
    hayError = true;
  }

  // Validar cantidad: mayor que 0 y que no supere el stock
  if (cantidad <= 0 || isNaN(cantidad)) {
    mostrarError("cantidad", "Ingrese una cantidad válida (mayor a 0).");
    hayError = true;
  } else if (productoEjemplo && cantidad > productoEjemplo.stock) {
    mostrarError("cantidad", `Solo hay ${productoEjemplo.stock} unidades en stock.`);
    hayError = true;
  }

  // Si hubo algún error, cancelar el envío
  if (hayError) {
    event.preventDefault();
  }
});
  // TODO estudiante:
  // Mejorar validación de correo.
  // Validar que la cantidad no supere el stock.
  // Mostrar mensajes de error en la página, no solo con alert.
document.getElementById("formContacto").addEventListener("submit", function(event) {
  const nombre = document.getElementById("nombreContacto").value.trim();
  const correo = document.getElementById("correoContacto").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  let hayError = false;

  limpiarError("nombreContacto");
  limpiarError("correoContacto");
  limpiarError("mensaje");

  // Validar nombre
  if (nombre === "") {
    mostrarError("nombreContacto", "Debe ingresar su nombre.");
    hayError = true;
  }

  // Validar correo (formato real)
  if (correo === "") {
    mostrarError("correoContacto", "Debe ingresar su correo.");
    hayError = true;
  } else if (!correoEsValido(correo)) {
    mostrarError("correoContacto", "El correo no tiene un formato válido.");
    hayError = true;
  }

  // Validar largo mínimo del mensaje (por ejemplo, 10 caracteres)
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
  // TODO estudiante:
  // Validar formato del correo.
  // Validar cantidad mínima de caracteres en el mensaje.
  // Mostrar mensajes de error junto a cada campo.

