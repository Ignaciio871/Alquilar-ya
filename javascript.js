// ==========================
// ESPERAR A QUE TODO SE CARGUE
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado");
  
  // Verificar que Firebase se cargó
  if (typeof firebase === 'undefined') {
    console.error("Firebase no se cargó correctamente");
    alert("Error: No se pudo cargar Firebase. Verifica tu conexión a internet.");
    return;
  }
  
  console.log("Firebase disponible");
  
  // ==========================
  // CONFIGURACIÓN DE FIREBASE
  // ==========================
  const firebaseConfig = {
    apiKey: "AIzaSyD-SZRbIvKX4gYvoYXggNPXb3SKbAQ0moM",
    authDomain: "carrito-de-compras-f3f3f.firebaseapp.com",
    projectId: "carrito-de-compras-f3f3f",
    storageBucket: "carrito-de-compras-f3f3f.firebasestorage.app",
    messagingSenderId: "526773706028",
    appId: "1:526773706028:web:01a1025054aa46360a6089",
    measurementId: "G-33GL0D4ELP"
  };

  // Inicializar Firebase
  try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado correctamente");
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    return;
  }

  const db = firebase.firestore();

  // ==========================
  // VARIABLES GLOBALES
  // ==========================
  let carrito = [];
  let salones = [];

  // ==========================
  // RENDERIZAR SALONES EN LA PÁGINA
  // ==========================
  function renderizarSalones() {
    const container = document.getElementById('salones');
    
    if (!container) {
      console.error('Contenedor de salones no encontrado');
      return;
    }

    if (salones.length === 0) {
      container.innerHTML = `
        <div class="container">
          <h2 class="section-title">Nuestros Salones</h2>
          <p class="text-center">Cargando salones...</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container">
        <h2 class="section-title">Nuestros Salones</h2>
        <div class="row">
          ${salones.map(salon => `
            <div class="col-md-4 mb-4">
              <div class="card salon-card h-100">
                <img src="${salon.imagen}" class="card-img-top" alt="${salon.nombre}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${salon.nombre}</h5>
                  <p class="card-text">${salon.descripcion}</p>
                  <div class="mt-auto">
                    <p class="mb-1"><strong>👥 Capacidad:</strong> ${salon.capacidad} personas</p>
                    <p class="precio-salon mb-3">$${salon.precio.toLocaleString()}</p>
                    <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${salon.id})">
                      🛒 Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    console.log(`✅ ${salones.length} salones renderizados en la página`);
  }

  // ==========================
  // CARGAR SALONES DESDE FIREBASE
  // ==========================
  function cargarSalonesDesdeFirebase() {
    console.log("Intentando cargar salones desde Firebase...");
    
    db.collection('productos').get()
      .then((snapshot) => {
        console.log("Salones obtenidos:", snapshot.size);
        
        if (snapshot.empty) {
          console.log("⚠️ No hay salones en Firebase");
          console.log("💡 Ejecutá: crearProductosEnFirebase()");
          return;
        }
        
        salones = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Salón:", data);
          
          // Usar el ID numérico del documento
          salones.push({
            id: parseInt(doc.id) || doc.id,
            nombre: data.nombre,
            precio: data.precio,
            capacidad: data.capacidad,
            imagen: data.imagen,
            descripcion: data.descripcion || ''
          });
        });
        
        console.log("Salones cargados desde Firebase:", salones);
        renderizarSalones();
      })
      .catch((error) => {
        console.error("Error al cargar salones desde Firebase:", error);
      });
  }

  // ==========================
  // ANIMAR BADGE DEL CARRITO
  // ==========================
  function animarBadge() {
    const badge = document.getElementById('badge-carrito');
    if (!badge) return;
    
    // Agregar clase de animación
    badge.classList.add('actualizado');
    
    // Remover la clase después de la animación
    setTimeout(() => {
      badge.classList.remove('actualizado');
    }, 500);
  }

  // ==========================
  // AGREGAR PRODUCTO AL CARRITO
  // ==========================
  window.agregarAlCarrito = function(id) {
    console.log("Agregando salón al carrito, ID:", id);
    
    const salon = salones.find(s => s.id === id);
    
    if (!salon) {
      console.error('Salón no encontrado');
      alert('Error: Salón no encontrado');
      return;
    }
    
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.cantidad++;
      console.log("Cantidad aumentada:", itemExistente);
    } else {
      carrito.push({
        ...salon,
        cantidad: 1
      });
      console.log("Nuevo salón agregado:", salon);
    }

    guardarCarritoEnFirebase();
    actualizarCarrito();
    animarBadge(); // Animar el badge
    mostrarNotificacion();
  }

  // ==========================
  // GUARDAR CARRITO EN FIREBASE
  // ==========================
  function guardarCarritoEnFirebase() {
    try {
      db.collection('carritos').doc('usuario-temporal').set({
        items: carrito,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("Carrito guardado en Firebase");
    } catch (error) {
      console.error("Error al guardar carrito:", error);
    }
  }

  // ==========================
  // ACTUALIZAR CARRITO
  // ==========================
  function actualizarCarrito() {
    const itemsContainer = document.getElementById('items-carrito');
    const resumenContainer = document.getElementById('resumen-carrito');
    const badge = document.getElementById('badge-carrito');

    if (!itemsContainer || !resumenContainer || !badge) {
      console.error('Elementos del carrito no encontrados en el DOM');
      return;
    }

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;

    if (carrito.length === 0) {
      itemsContainer.innerHTML = `
        <div class="carrito-vacio">
          <div class="carrito-vacio-icono">🛒</div>
          <p>Tu carrito está vacío</p>
          <small>Agregá salones para tu evento</small>
        </div>
      `;
      resumenContainer.style.display = 'none';
      return;
    }

    itemsContainer.innerHTML = carrito.map(item => `
      <div class="item-carrito">
        <img src="${item.imagen}" alt="${item.nombre}" class="item-img">
        <div class="item-info">
          <div class="item-nombre">${item.nombre}</div>
          <div class="item-precio">$${item.precio.toLocaleString()}</div>
        </div>
        <div class="item-acciones">
          <div class="cantidad-control">
            <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">−</button>
            <span class="cantidad-display">${item.cantidad}</span>
            <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
          </div>
          <button class="btn-eliminar" onclick="eliminarItem(${item.id})">🗑️</button>
        </div>
      </div>
    `).join('');

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const descuento = subtotal * 0.1;
    const total = subtotal - descuento;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('descuento').textContent = `-$${descuento.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;

    resumenContainer.style.display = 'block';
  }

  // ==========================
  // CAMBIAR CANTIDAD
  // ==========================
  window.cambiarCantidad = function(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (item) {
      item.cantidad += cambio;
      if (item.cantidad <= 0) {
        eliminarItem(id);
      } else {
        guardarCarritoEnFirebase();
        actualizarCarrito();
        animarBadge(); // Animar cuando cambia cantidad
      }
    }
  }

  // ==========================
  // ELIMINAR ITEM
  // ==========================
  window.eliminarItem = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoEnFirebase();
    actualizarCarrito();
    animarBadge(); // Animar cuando se elimina
  }

  // ==========================
  // VACIAR CARRITO
  // ==========================
  window.vaciarCarrito = function() {
    if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
      carrito = [];
      guardarCarritoEnFirebase();
      actualizarCarrito();
    }
  }

  // ==========================
  // TOGGLE CARRITO
  // ==========================
  window.toggleCarrito = function() {
    const panel = document.getElementById('carrito-panel');
    const overlay = document.getElementById('overlay');
    
    if (!panel || !overlay) {
      console.error('Panel o overlay del carrito no encontrados');
      return;
    }
    
    panel.classList.toggle('abierto');
    overlay.classList.toggle('activo');
  }

  // ==========================
  // CERRAR CARRITO
  // ==========================
  window.cerrarCarrito = function() {
    const panel = document.getElementById('carrito-panel');
    const overlay = document.getElementById('overlay');
    
    if (!panel || !overlay) {
      console.error('Panel o overlay del carrito no encontrados');
      return;
    }
    
    panel.classList.remove('abierto');
    overlay.classList.remove('activo');
  }

  // ==========================
  // MOSTRAR NOTIFICACIÓN
  // ==========================
  function mostrarNotificacion() {
    const notif = document.getElementById('notificacion');
    
    if (!notif) {
      console.error('Elemento de notificación no encontrado');
      return;
    }
    
    notif.classList.add('mostrar');
    
    setTimeout(() => {
      notif.classList.remove('mostrar');
    }, 2500);
  }

  // ==========================
  // FINALIZAR COMPRA
  // ==========================
  window.finalizarCompra = function() {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal * 0.9;

    let mensaje = '🎉 RESUMEN DE TU RESERVA\n\n';
    carrito.forEach(item => {
      mensaje += `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });
    mensaje += `\n💰 TOTAL A PAGAR: $${total.toLocaleString()}`;
    mensaje += '\n\n¡Gracias por tu reserva! Nos contactaremos pronto para confirmar los detalles.';

    db.collection('pedidos').add({
      items: carrito,
      subtotal: subtotal,
      descuento: subtotal * 0.1,
      total: total,
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      estado: 'pendiente'
    })
    .then(() => {
      console.log("Pedido guardado en Firebase");
      alert(mensaje);
      carrito = [];
      guardarCarritoEnFirebase();
      actualizarCarrito();
      cerrarCarrito();
    })
    .catch((error) => {
      console.error("Error al guardar pedido:", error);
      alert(mensaje + "\n\nNota: Error al guardar en la base de datos.");
      carrito = [];
      actualizarCarrito();
      cerrarCarrito();
    });
  }

  // ==========================
  // SMOOTH SCROLL
  // ==========================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ==========================
  // INICIALIZACIÓN
  // ==========================
  console.log("Inicializando aplicación...");
  cargarSalonesDesdeFirebase();

  console.log("✅ Aplicación inicializada correctamente");
  
}); // FIN DOMContentLoaded

// ==========================
// CREAR PRODUCTOS EN FIREBASE (EJECUTAR UNA SOLA VEZ)
// ==========================
window.crearProductosEnFirebase = async function() {
  const db = firebase.firestore();
  
  const productos = [
    {
      nombre: "Salón Elegance",
      precio: 85000,
      capacidad: 150,
      imagen: "https://picsum.photos/500/300?random=1",
      descripcion: "Ideal para bodas y eventos formales. Decoración elegante, iluminación profesional y sistema de sonido incluido."
    },
    {
      nombre: "Salón Fiesta",
      precio: 95000,
      capacidad: 200,
      imagen: "https://picsum.photos/500/300?random=2",
      descripcion: "Perfecto para cumpleaños de 15 y fiestas. Pista de baile amplia, luces LED y DJ incluido."
    },
    {
      nombre: "Salón Garden",
      precio: 65000,
      capacidad: 100,
      imagen: "https://picsum.photos/500/300?random=3",
      descripcion: "Ambiente íntimo con jardín. Ideal para eventos al aire libre y celebraciones familiares."
    },
    {
      nombre: "Salón Corporate",
      precio: 55000,
      capacidad: 80,
      imagen: "https://picsum.photos/500/300?random=4",
      descripcion: "Diseñado para eventos empresariales. Proyector, pantalla, WiFi de alta velocidad y catering."
    },
    {
      nombre: "Salón Premium",
      precio: 120000,
      capacidad: 250,
      imagen: "https://picsum.photos/500/300?random=5",
      descripcion: "Nuestro salón más grande y lujoso. Todo incluido para el evento de tus sueños."
    },
    {
      nombre: "Salón Vintage",
      precio: 70000,
      capacidad: 120,
      imagen: "https://picsum.photos/500/300?random=6",
      descripcion: "Estilo clásico y acogedor. Perfecto para celebraciones con encanto especial."
    }
  ];

  console.log("🔥 Creando productos en Firebase...");

  try {
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      const docId = String(i + 1);
      
      await db.collection('productos').doc(docId).set(producto);
      console.log(`✅ Producto ${i + 1} creado: ${producto.nombre}`);
    }

    console.log("🎉 ¡Todos los productos fueron creados exitosamente!");
    alert("✅ Productos creados en Firebase. Recargá la página (F5) para verlos.");
    
  } catch (error) {
    console.error("❌ Error al crear productos:", error);
    alert("Error: " + error.message);
  }
}

console.log("📦 Sistema de carrito cargado");
console.log("🔥 Para crear productos en Firebase, ejecuta: crearProductosEnFirebase()");