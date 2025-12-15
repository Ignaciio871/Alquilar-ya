// ==========================
// ESPERAR A QUE TODO SE CARGUE
// ==========================

// Esto dice: "esperá a que se cargue todo el HTML antes de ejecutar el código"
document.addEventListener('DOMContentLoaded', function() {
  
  // Escribir en la consola del navegador (F12 para verla)
  console.log("DOM cargado");
  
  // ==========================
  // VERIFICAR QUE FIREBASE EXISTE
  // ==========================
  
  // Pregunto: ¿existe Firebase? Si no existe, es undefined
  if (typeof firebase === 'undefined') {
    
    // Escribir ERROR en rojo en la consola
    console.error("Firebase no se cargó correctamente");
    
    // Mostrar ventanita de alerta al usuario
    alert("Error: No se pudo cargar Firebase. Verifica tu conexión a internet.");
    
    // STOP: no seguir ejecutando el resto del código
    return;
  }
  
  // Si llegamos acá, Firebase SÍ existe
  console.log("Firebase disponible");
  
  // ==========================
  // CONFIGURACIÓN DE FIREBASE
  // ==========================
  
  // Este objeto tiene todos los datos de tu proyecto de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyD-SZRbIvKX4gYvoYXggNPXb3SKbAQ0moM", // Tu contraseña de Firebase
    authDomain: "carrito-de-compras-f3f3f.firebaseapp.com", // Dónde está tu Firebase
    projectId: "carrito-de-compras-f3f3f", // Nombre de tu proyecto
    storageBucket: "carrito-de-compras-f3f3f.firebasestorage.app", // Donde se guardan archivos
    messagingSenderId: "526773706028", // Para notificaciones
    appId: "1:526773706028:web:01a1025054aa46360a6089", // ID de tu app
    measurementId: "G-33GL0D4ELP" // Para estadísticas
  };

  // Intentar conectar con Firebase
  try {
    
    // Iniciar Firebase con tu configuración
    firebase.initializeApp(firebaseConfig);
    
    // Si funcionó, escribir en consola
    console.log("Firebase inicializado correctamente");
    
  } catch (error) {
    
    // Si algo salió mal, mostrar el error
    console.error("Error al inicializar Firebase:", error);
    
    // STOP: no seguir
    return;
  }

  // Crear una "conexión" a la base de datos Firestore
  // "db" es como decir "mi base de datos"
  const db = firebase.firestore();

  // ==========================
  // VARIABLES GLOBALES
  // ==========================
  
  // Array (lista) vacía para guardar lo que el usuario pone en el carrito
  let carrito = [];
  
  // Array (lista) vacía para guardar los salones que traemos de Firebase
  let salones = [];

  // ==========================
  // RENDERIZAR SALONES EN LA PÁGINA
  // ==========================
  
  // Esta función pone los salones en la página web
  function renderizarSalones() {
    
    // Buscar en el HTML el elemento con id="salones"
    const container = document.getElementById('salones');
    
    // Preguntar: ¿existe ese elemento?
    if (!container) {
      
      // Si no existe, mostrar error y salir
      console.error('Contenedor de salones no encontrado');
      return; // STOP
    }

    // Preguntar: ¿el array de salones está vacío?
    if (salones.length === 0) {
      
      // Si está vacío, mostrar mensaje de "Cargando..."
      container.innerHTML = `
        <div class="container">
          <h2 class="section-title">Nuestros Salones</h2>
          <p class="text-center">Cargando salones...</p>
        </div>
      `;
      
      // Salir de la función
      return;
    }

    // Si llegamos acá, tenemos salones para mostrar
    // Crear el HTML con todos los salones CON TODA LA INFORMACIÓN
    container.innerHTML = `
      <div class="container">
        <h2 class="section-title">Nuestros Salones</h2>
        <div class="row">
          ${
            // Recorrer cada salón del array
            salones.map(salon => `
              <div class="col-md-4 mb-4">
                <div class="card salon-card h-100">
                  
                  <!-- Imagen del salón -->
                  <img src="${salon.imagen}" class="card-img-top" alt="${salon.nombre}">
                  
                  <div class="card-body d-flex flex-column">
                    
                    <!-- Nombre del salón -->
                    <h5 class="card-title">${salon.nombre}</h5>
                    
                    <!-- Tipo de evento (si existe) -->
                    ${salon.tipoEvento ? `
                      <p class="salon-tipo-evento">🎉 ${salon.tipoEvento}</p>
                    ` : ''}
                    
                    <!-- Descripción del salón -->
                    <p class="card-text">${salon.descripcion}</p>
                    
                    <!-- INFORMACIÓN DETALLADA DEL SALÓN -->
                    <div class="salon-info-detallada">
                      
                      <!-- Capacidad de personas -->
                      <div class="info-item">
                        <span class="info-icono">👥</span>
                        <span><strong>Capacidad:</strong> ${salon.capacidad} personas</span>
                      </div>
                      
                      <!-- Metros cuadrados (si existe) -->
                      ${salon.metrosCuadrados ? `
                        <div class="info-item">
                          <span class="info-icono">📐</span>
                          <span><strong>Tamaño:</strong> ${salon.metrosCuadrados} m²</span>
                        </div>
                      ` : ''}
                      
                      <!-- Ubicación (si existe) -->
                      ${salon.ubicacion ? `
                        <div class="info-item">
                          <span class="info-icono">📍</span>
                          <span><strong>Ubicación:</strong> ${salon.ubicacion}</span>
                        </div>
                      ` : ''}
                      
                      <!-- Horario (si existe) -->
                      ${salon.horario ? `
                        <div class="info-item">
                          <span class="info-icono">🕐</span>
                          <span><strong>Horario:</strong> ${salon.horario}</span>
                        </div>
                      ` : ''}
                      
                    </div>
                    
                    <!-- CARACTERÍSTICAS (si existen) -->
                    ${salon.caracteristicas && salon.caracteristicas.length > 0 ? `
                      <div class="salon-caracteristicas">
                        <h6 class="caracteristicas-titulo">✨ Características:</h6>
                        <ul class="caracteristicas-lista">
                          ${salon.caracteristicas.slice(0, 4).map(carac => `
                            <li>✓ ${carac}</li>
                          `).join('')}
                          ${salon.caracteristicas.length > 4 ? `
                            <li class="mas-caracteristicas">+ ${salon.caracteristicas.length - 4} más...</li>
                          ` : ''}
                        </ul>
                      </div>
                    ` : ''}
                    
                    <!-- SERVICIOS INCLUIDOS (si existen) -->
                    ${salon.serviciosIncluidos && salon.serviciosIncluidos.length > 0 ? `
                      <div class="salon-servicios">
                        <h6 class="servicios-titulo">🎁 Servicios Incluidos:</h6>
                        <ul class="servicios-lista">
                          ${salon.serviciosIncluidos.slice(0, 3).map(serv => `
                            <li>✓ ${serv}</li>
                          `).join('')}
                          ${salon.serviciosIncluidos.length > 3 ? `
                            <li class="mas-servicios">+ ${salon.serviciosIncluidos.length - 3} más...</li>
                          ` : ''}
                        </ul>
                      </div>
                    ` : ''}
                    
                    <!-- EQUIPAMIENTO (si existe) -->
                    ${salon.equipamiento && salon.equipamiento.length > 0 ? `
                      <div class="salon-equipamiento">
                        <h6 class="equipamiento-titulo">🔧 Equipamiento:</h6>
                        <ul class="equipamiento-lista">
                          ${salon.equipamiento.slice(0, 3).map(equip => `
                            <li>✓ ${equip}</li>
                          `).join('')}
                          ${salon.equipamiento.length > 3 ? `
                            <li class="mas-equipamiento">+ ${salon.equipamiento.length - 3} más...</li>
                          ` : ''}
                        </ul>
                      </div>
                    ` : ''}
                    
                    <div class="mt-auto">
                      
                      <!-- Precio (toLocaleString pone los puntos: 85.000) -->
                      <p class="precio-salon mb-3">${salon.precio.toLocaleString()}</p>
                      
                      <!-- Botón para agregar al carrito (onclick llama a la función) -->
                      <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${salon.id})">
                        🛒 Agregar al Carrito
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            `).join('') 
            // .join('') une todo en un solo texto sin separadores
          }
        </div>
      </div>
    `;

    // Escribir en consola cuántos salones se mostraron
    console.log(`✅ ${salones.length} salones renderizados en la página`);
  }

  // ==========================
  // CARGAR SALONES DESDE FIREBASE
  // ==========================
  
  // Esta función trae los salones desde Firebase
  function cargarSalonesDesdeFirebase() {
    
    // Escribir en consola
    console.log("Intentando cargar salones desde Firebase...");
    
    // Ir a Firebase y traer todos los documentos de la colección "productos"
    db.collection('productos').get()
      
      // .then significa "cuando termine de traer los datos, hacer esto:"
      .then((snapshot) => {
        
        // snapshot es como una "foto" de todos los datos
        // .size dice cuántos documentos hay
        console.log("Salones obtenidos:", snapshot.size);
        
        // Preguntar: ¿está vacío?
        if (snapshot.empty) {
          
          // Si está vacío, avisar
          console.log("⚠️ No hay salones en Firebase");
          console.log("💡 Necesitás agregar productos en Firebase Console");
          
          // Salir de la función
          return;
        }
        
        // Vaciar el array de salones (por si tenía algo viejo)
        salones = [];
        
        // Recorrer cada documento que trajo Firebase
        snapshot.forEach((doc) => {
          
          // .data() saca los datos del documento
          const data = doc.data();
          
          // Mostrar en consola cada salón
          console.log("Salón:", data);
          
          // Agregar este salón al array con TODA la información
          salones.push({
            
            // El ID del documento lo convertimos a número
            // Si no se puede convertir, lo dejamos como string
            id: parseInt(doc.id) || doc.id,
            
            // Nombre del salón
            nombre: data.nombre,
            
            // Precio del salón
            precio: data.precio,
            
            // Capacidad (cantidad de personas)
            capacidad: data.capacidad,
            
            // URL de la imagen
            imagen: data.imagen,
            
            // Descripción (si no tiene, poner texto vacío)
            descripcion: data.descripcion || '',
            
            // NUEVOS CAMPOS DE INFORMACIÓN DETALLADA
            // Metros cuadrados del salón
            metrosCuadrados: data.metrosCuadrados || data.metros_cuadrados || null,
            
            // Ubicación del salón
            ubicacion: data.ubicacion || '',
            
            // Características del salón (array de strings)
            caracteristicas: data.caracteristicas || [],
            
            // Servicios incluidos (array de strings)
            serviciosIncluidos: data.serviciosIncluidos || data.servicios_incluidos || [],
            
            // Tipo de evento (bodas, cumpleaños, corporativo, etc.)
            tipoEvento: data.tipoEvento || data.tipo_evento || '',
            
            // Horario disponible
            horario: data.horario || '',
            
            // Equipamiento disponible
            equipamiento: data.equipamiento || []
          });
        });
        
        // Escribir en consola todos los salones cargados
        console.log("Salones cargados desde Firebase:", salones);
        
        // Ahora mostrar los salones en el HTML
        renderizarSalones();
      })
      
      // .catch significa "si hay un error, hacer esto:"
      .catch((error) => {
        
        // Mostrar el error en consola
        console.error("Error al cargar salones desde Firebase:", error);
      });
  }

  // ==========================
  // ANIMAR BADGE DEL CARRITO
  // ==========================
  
  // Esta función hace que el numerito rojo del carrito "salte"
  function animarBadge() {
    
    // Buscar el elemento con id="badge-carrito"
    const badge = document.getElementById('badge-carrito');
    
    // Si no existe, salir
    if (!badge) return;
    
    // Agregarle una clase CSS que tiene la animación
    badge.classList.add('actualizado');
    
    // Después de medio segundo (500 milisegundos)...
    setTimeout(() => {
      
      // Quitarle la clase (para que se pueda animar de nuevo después)
      badge.classList.remove('actualizado');
      
    }, 500); // 500 = medio segundo
  }

  // ==========================
  // AGREGAR PRODUCTO AL CARRITO
  // ==========================
  
  // Esta función se llama cuando hacés click en "Agregar al Carrito"
  // "window." hace que se pueda usar desde el HTML
  window.agregarAlCarrito = function(id) {
    
    // Escribir en consola qué salón estamos agregando
    console.log("Agregando salón al carrito, ID:", id);
    
    // Buscar en el array "salones" el que tiene este ID
    // .find busca y devuelve el primero que cumple la condición
    const salon = salones.find(s => s.id === id);
    
    // Preguntar: ¿lo encontró?
    if (!salon) {
      
      // Si no lo encontró, mostrar error
      console.error('Salón no encontrado');
      alert('Error: Salón no encontrado');
      
      // Salir de la función
      return;
    }
    
    // Buscar si este salón YA está en el carrito
    const itemExistente = carrito.find(item => item.id === id);

    // Preguntar: ¿ya está en el carrito?
    if (itemExistente) {
      
      // Si ya está, solo aumentar la cantidad en 1
      itemExistente.cantidad++;
      
      // Escribir en consola
      console.log("Cantidad aumentada:", itemExistente);
      
    } else {
      
      // Si NO está en el carrito, agregarlo
      carrito.push({
        
        // ...salon copia TODAS las propiedades del salón
        // (nombre, precio, capacidad, imagen, descripcion, características, etc.)
        ...salon,
        
        // Agregar la propiedad "cantidad" con valor 1
        cantidad: 1
      });
      
      // Escribir en consola
      console.log("Nuevo salón agregado:", salon);
    }

    // Guardar el carrito en Firebase
    guardarCarritoEnFirebase();
    
    // Actualizar lo que se ve en la página
    actualizarCarrito();
    
    // Hacer que el numerito salte
    animarBadge();
    
    // Mostrar notificación verde de "Agregado"
    mostrarNotificacion();
  }

  // ==========================
  // GUARDAR CARRITO EN FIREBASE
  // ==========================
  
  // Esta función guarda el carrito en Firebase
  function guardarCarritoEnFirebase() {
    
    // Intentar guardar
    try {
      
      // Ir a la colección "carritos" y al documento "usuario-temporal"
      // .set() guarda o reemplaza el documento
      db.collection('carritos').doc('usuario-temporal').set({
        
        // Guardar el array del carrito
        items: carrito,
        
        // Guardar la fecha y hora del servidor
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Escribir en consola que se guardó
      console.log("Carrito guardado en Firebase");
      
    } catch (error) {
      
      // Si hubo error, mostrarlo
      console.error("Error al guardar carrito:", error);
    }
  }

  // ==========================
  // ACTUALIZAR CARRITO CON INFORMACIÓN COMPLETA
  // ==========================
  
  // Esta función actualiza lo que se ve en el panel del carrito
  function actualizarCarrito() {
    
    // Buscar el contenedor de los items del carrito
    const itemsContainer = document.getElementById('items-carrito');
    
    // Buscar el contenedor del resumen (subtotal, descuento, total)
    const resumenContainer = document.getElementById('resumen-carrito');
    
    // Buscar el numerito rojo
    const badge = document.getElementById('badge-carrito');

    // Verificar que TODOS existen
    if (!itemsContainer || !resumenContainer || !badge) {
      
      // Si falta alguno, mostrar error y salir
      console.error('Elementos del carrito no encontrados en el DOM');
      return;
    }

    // Sumar TODAS las cantidades de TODOS los items
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Poner ese número en el badge
    badge.textContent = totalItems;

    // Preguntar: ¿el carrito está vacío?
    if (carrito.length === 0) {
      
      // Si está vacío, mostrar mensaje
      itemsContainer.innerHTML = `
        <div class="carrito-vacio">
          <div class="carrito-vacio-icono">🛒</div>
          <p>Tu carrito está vacío</p>
          <small>Agregá salones para tu evento</small>
        </div>
      `;
      
      // Ocultar el resumen de precios
      resumenContainer.style.display = 'none';
      
      // Salir de la función
      return;
    }

    // ==========================
    // MOSTRAR CADA PRODUCTO CON TODA LA INFORMACIÓN
    // ==========================
    
    // Si llegamos acá, hay items en el carrito
    // Crear el HTML de cada item CON TODOS LOS DETALLES
    itemsContainer.innerHTML = carrito.map(item => {
      
      // Calcular el subtotal de ESTE item (precio × cantidad)
      const subtotalItem = item.precio * item.cantidad;
      
      // Crear el HTML con TODA la información disponible
      return `
        <div class="item-carrito-detallado">
          
          <!-- ========== SECCIÓN 1: HEADER CON IMAGEN Y NOMBRE ========== -->
          <div class="item-header">
            
            <!-- Imagen del salón (más grande) -->
            <img src="${item.imagen}" alt="${item.nombre}" class="item-img-grande">
            
            <div class="item-info-principal">
              
              <!-- Nombre del salón (destacado) -->
              <h4 class="item-nombre-destacado">${item.nombre}</h4>
              
              <!-- Precio unitario -->
              <p class="item-precio-unitario">
                <strong>💵 Precio por reserva:</strong> $${item.precio.toLocaleString()}
              </p>
              
              ${item.tipoEvento ? `
                <p class="item-tipo-evento">
                  <strong>🎉 Tipo de evento:</strong> ${item.tipoEvento}
                </p>
              ` : ''}
              
            </div>
            
          </div>
          
          <!-- ========== SECCIÓN 2: INFORMACIÓN BÁSICA ========== -->
          <div class="item-detalles">
            <h5 class="detalles-titulo">📋 Información del Salón</h5>
            
            <!-- Capacidad -->
            <div class="detalle-item">
              <span class="detalle-icono">👥</span>
              <div>
                <strong>Capacidad:</strong>
                <p>${item.capacidad} personas</p>
              </div>
            </div>
            
            <!-- Metros cuadrados (si existe) -->
            ${item.metrosCuadrados ? `
              <div class="detalle-item">
                <span class="detalle-icono">📐</span>
                <div>
                  <strong>Tamaño:</strong>
                  <p>${item.metrosCuadrados} m²</p>
                </div>
              </div>
            ` : ''}
            
            <!-- Ubicación (si existe) -->
            ${item.ubicacion ? `
              <div class="detalle-item">
                <span class="detalle-icono">📍</span>
                <div>
                  <strong>Ubicación:</strong>
                  <p>${item.ubicacion}</p>
                </div>
              </div>
            ` : ''}
            
            <!-- Horario (si existe) -->
            ${item.horario ? `
              <div class="detalle-item">
                <span class="detalle-icono">🕐</span>
                <div>
                  <strong>Horario disponible:</strong>
                  <p>${item.horario}</p>
                </div>
              </div>
            ` : ''}
            
            <!-- Descripción (si existe) -->
            ${item.descripcion ? `
              <div class="detalle-item">
                <span class="detalle-icono">📝</span>
                <div>
                  <strong>Descripción:</strong>
                  <p>${item.descripcion}</p>
                </div>
              </div>
            ` : ''}
            
          </div>
          
          <!-- ========== SECCIÓN 3: CARACTERÍSTICAS ========== -->
          ${item.caracteristicas && item.caracteristicas.length > 0 ? `
            <div class="item-caracteristicas">
              <h5 class="detalles-titulo">✨ Características</h5>
              <ul class="lista-caracteristicas">
                ${item.caracteristicas.map(carac => `
                  <li>✓ ${carac}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <!-- ========== SECCIÓN 4: SERVICIOS INCLUIDOS ========== -->
          ${item.serviciosIncluidos && item.serviciosIncluidos.length > 0 ? `
            <div class="item-servicios">
              <h5 class="detalles-titulo">🎁 Servicios Incluidos</h5>
              <ul class="lista-servicios">
                ${item.serviciosIncluidos.map(serv => `
                  <li>✓ ${serv}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <!-- ========== SECCIÓN 5: EQUIPAMIENTO ========== -->
          ${item.equipamiento && item.equipamiento.length > 0 ? `
            <div class="item-equipamiento">
              <h5 class="detalles-titulo">🔧 Equipamiento Disponible</h5>
              <ul class="lista-equipamiento">
                ${item.equipamiento.map(equip => `
                  <li>✓ ${equip}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <!-- ========== SECCIÓN 6: SUBTOTAL Y CANTIDAD ========== -->
          <div class="item-precio-total">
            <div class="detalle-item">
              <span class="detalle-icono">💰</span>
              <div>
                <strong>Subtotal (${item.cantidad} ${item.cantidad === 1 ? 'reserva' : 'reservas'}):</strong>
                <p class="subtotal-item">$${subtotalItem.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <!-- ========== SECCIÓN 7: CONTROLES ========== -->
          <div class="item-acciones-detalladas">
            
            <div class="cantidad-control-mejorado">
              <label>Cantidad de reservas:</label>
              <div class="botones-cantidad">
                <!-- Botón para restar (−) -->
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)" title="Reducir cantidad">−</button>
                
                <!-- Mostrar la cantidad actual -->
                <span class="cantidad-display">${item.cantidad}</span>
                
                <!-- Botón para sumar (+) -->
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)" title="Aumentar cantidad">+</button>
              </div>
            </div>
            
            <!-- Botón para eliminar -->
            <button class="btn-eliminar-mejorado" onclick="eliminarItem(${item.id})" title="Eliminar del carrito">
              🗑️ Eliminar
            </button>
            
          </div>
          
          <!-- Línea divisoria entre productos -->
          <hr class="item-separador">
          
        </div>
      `;
    }).join(''); 

    // Calcular el subtotal (sin descuento)
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Calcular el 10% de descuento
    const descuento = subtotal * 0.1;
    
    // Calcular el total (subtotal - descuento)
    const total = subtotal - descuento;

    // Actualizar los textos de precios en el HTML
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('descuento').textContent = `-$${descuento.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;

    // Mostrar el contenedor del resumen
    resumenContainer.style.display = 'block';
    
    // Escribir en consola información del carrito
    console.log(`🛒 Carrito actualizado: ${totalItems} items, Total: $${total.toLocaleString()}`);
  }

  // ==========================
  // CAMBIAR CANTIDAD
  // ==========================
  
  // Esta función aumenta o disminuye la cantidad de un item
  window.cambiarCantidad = function(id, cambio) {
    
    // Buscar el item en el carrito
    const item = carrito.find(i => i.id === id);
    
    // Preguntar: ¿existe?
    if (item) {
      
      // Sumar o restar (según lo que venga en "cambio")
      item.cantidad += cambio;
      
      // Preguntar: ¿llegó a 0 o menos?
      if (item.cantidad <= 0) {
        
        // Si es 0 o menos, eliminar el item
        eliminarItem(id);
        
      } else {
        
        // Si todavía tiene cantidad, guardar y actualizar
        guardarCarritoEnFirebase();
        actualizarCarrito();
        animarBadge();
      }
    }
  }

  // ==========================
  // ELIMINAR ITEM
  // ==========================
  
  // Esta función saca un producto del carrito
  window.eliminarItem = function(id) {
    
    // Filtrar el array: quedarse con TODOS menos el que tiene este ID
    carrito = carrito.filter(item => item.id !== id);
    
    // Guardar el cambio en Firebase
    guardarCarritoEnFirebase();
    
    // Actualizar lo que se ve
    actualizarCarrito();
    
    // Animar el numerito
    animarBadge();
  }

  // ==========================
  // VACIAR CARRITO
  // ==========================
  
  // Esta función vacía TODO el carrito
  window.vaciarCarrito = function() {
    
    // Preguntar al usuario si está seguro
    if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
      
      // Si dice OK, vaciar el array
      carrito = [];
      
      // Guardar en Firebase
      guardarCarritoEnFirebase();
      
      // Actualizar lo que se ve
      actualizarCarrito();
    }
  }

  // ==========================
  // TOGGLE CARRITO
  // ==========================
  
  // Esta función abre o cierra el panel del carrito
  window.toggleCarrito = function() {
    
    // Buscar el panel del carrito
    const panel = document.getElementById('carrito-panel');
    
    // Buscar el fondo oscuro (overlay)
    const overlay = document.getElementById('overlay');
    
    // Verificar que existen
    if (!panel || !overlay) {
      console.error('Panel o overlay del carrito no encontrados');
      return;
    }
    
    // Alternar la clase "abierto"
    panel.classList.toggle('abierto');
    
    // Lo mismo con el overlay
    overlay.classList.toggle('activo');
  }

  // ==========================
  // CERRAR CARRITO
  // ==========================
  
  // Esta función SIEMPRE cierra el carrito
  window.cerrarCarrito = function() {
    
    // Buscar elementos
    const panel = document.getElementById('carrito-panel');
    const overlay = document.getElementById('overlay');
    
    // Verificar que existen
    if (!panel || !overlay) {
      console.error('Panel o overlay del carrito no encontrados');
      return;
    }
    
    // Quitar las clases que hacen que esté abierto
    panel.classList.remove('abierto');
    overlay.classList.remove('activo');
  }

  // ==========================
  // MOSTRAR NOTIFICACIÓN
  // ==========================
  
  // Esta función muestra la notificación verde de "Agregado al carrito"
  function mostrarNotificacion() {
    
    // Buscar el elemento de notificación
    const notif = document.getElementById('notificacion');
    
    // Verificar que existe
    if (!notif) {
      console.error('Elemento de notificación no encontrado');
      return;
    }
    
    // Agregarle la clase "mostrar"
    notif.classList.add('mostrar');
    
    // Después de 2.5 segundos...
    setTimeout(() => {
      
      // Quitarle la clase (se oculta)
      notif.classList.remove('mostrar');
      
    }, 2500);
  }

  // ==========================
  // FINALIZAR COMPRA
  // ==========================
  
  // Esta función guarda el pedido en Firebase y vacía el carrito
  window.finalizarCompra = function() {
    
    // Verificar que el carrito NO esté vacío
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Calcular subtotal (sin descuento)
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Calcular total con 10% de descuento
    const total = subtotal * 0.9;

    // Crear el mensaje para mostrar al usuario
    let mensaje = '🎉 RESUMEN DE TU RESERVA\n\n';
    
    // Agregar cada item al mensaje
    carrito.forEach(item => {
      mensaje += `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });
    
    // Agregar el total
    mensaje += `\n💰 TOTAL A PAGAR: $${total.toLocaleString()}`;
    
    // Agregar mensaje final
    mensaje += '\n\n¡Gracias por tu reserva! Nos contactaremos pronto para confirmar los detalles.';

    // Guardar el pedido en Firebase
    db.collection('pedidos').add({
      
      // Los items del carrito
      items: carrito,
      
      // El subtotal (sin descuento)
      subtotal: subtotal,
      
      // Cuánto se descontó
      descuento: subtotal * 0.1,
      
      // El total final
      total: total,
      
      // La fecha del servidor
      fecha: firebase.firestore.FieldValue.serverTimestamp(),
      
      // El estado del pedido
      estado: 'pendiente'
    })
    .then(() => {
      
      console.log("Pedido guardado en Firebase");
      alert(mensaje);
      
      // Vaciar el carrito
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
  // ==========================
  // SMOOTH SCROLL
  // ==========================
  
  // Buscar TODOS los enlaces que empiezan con #
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================
  // INICIAR LA APLICACIÓN
  // ==========================
  
  console.log("🚀 Iniciando aplicación...");
  
  // 1. Cargar salones desde Firebase
  cargarSalonesDesdeFirebase();
  
  // 2. Cargar carrito guardado (si existe)
  db.collection('carritos').doc('usuario-temporal').get()
    .then((doc) => {
      if (doc.exists && doc.data().items) {
        carrito = doc.data().items;
        console.log("Carrito recuperado de Firebase:", carrito);
        actualizarCarrito();
      } else {
        console.log("No hay carrito guardado");
      }
    })
    .catch((error) => {
      console.error("Error al cargar carrito guardado:", error);
    });
  
  console.log("✅ Aplicación iniciada");

}); // <--- CIERRA el addEventListener('DOMContentLoaded')
 