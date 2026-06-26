# Tienda de Productos Electrónicos

**Evaluación Unidad Metodológica Mínima (UMM) – Programación Web**.
Sitio web estático de una tienda que carga productos electroonicos desde un archivo JSON local,
permite simular una compra y enviar la información por correo mediante FormSubmit.

## Enlaces de entrega

- **Repositorio GitHub:** https://github.com/karlo-co/matiwiwi
- **Sitio publicado (GitHub Pages):** https://karlo-co.github.io/matiwiwi/

## Integrantes

- Integrante 1: Carlos gonzalez
- Sección / Jornada: despertina
- Correo de pruebas: carlos.gonzalez.acevedo1997@gmail.com

## Tecnologías utilizadas

- **HTML5** con estructura semántica (header, nav, main, section, footer).
- **CSS3** externo y responsivo (media queries).
- **JavaScript** para leer el JSON, manipular el DOM, manejar eventos y validar.
- **JSON local** (`data/productos.json`) como base de datos estática de productos.
- **FormSubmit** para el envío de los formularios por correo.
- **GitHub Pages** para la publicación del sitio.

## Estructura del proyecto

```
matiwiwi/
├── index.html          Página principal (inicio, quiénes somos, productos, contacto)
├── gracias.html        Página de confirmación tras enviar un formulario
├── css/
│   └── style.css       Estilos del sitio (responsivo)
├── js/
│   └── app.js          Lógica: carga JSON, cálculo de compra y validaciones
├── data/
│   └── productos.json  Base de datos local de productos
└── README.md           Este documento
```

## Validaciones implementadas (JavaScript)

- Campos obligatorios no vacíos (nombre, correo, asunto, mensaje).
- Formato de correo electrónico válido (expresión regular).
- Cantidad mayor a cero y que no supere el stock disponible del JSON.
- Al menos un producto seleccionado antes de enviar la boleta.
- Largo mínimo del mensaje de contacto (10 caracteres).
- Los mensajes de error se muestran junto a cada campo (no con `alert`).
- Se evita el envío del formulario cuando existen errores (`preventDefault`).

