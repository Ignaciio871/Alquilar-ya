const productos = [
    { id: 1, nombre: "Gran Oasis", precio: 5000, img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
    { id: 2, nombre: "Jardín Esmeralda", precio: 4500, img: "https://images.unsplash.com/photo-1523905330026-b8bd1f3b7b36?auto=format&fit=crop&w=400&q=80" },
    { id: 3, nombre: "Salón Laguna Azul", precio: 5500, img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80" },
    { id: 4, nombre: "Salon Los Paramos", precio: 8500, img: "https://tse3.mm.bing.net/th/id/OIP.JwrCDQzDSvkwy6kvbqnwtwHaFL?pid=Api&P=0&h=180" },
    { id: 5, nombre: "La Estancia", precio: 3500, img: "https://tse1.mm.bing.net/th/id/OIP.o7EZJDfT8oQeLFcCrto5HAHaFj?pid=Api&P=0&h=180  " },
    { id: 6, nombre: "Salon Entre Bosques", precio: 7000, img: "https://tse3.mm.bing.net/th/id/OIP.BZuS4HIIGuXDxuLg0-sT-wHaE8?pid=Api&P=0&h=180" },
    { id: 6, nombre: "Fiesta Disco", precio: 10000, img: "https://tse3.mm.bing.net/th/id/OIP.qZWm7vssxDQWFlVjCR0ubQHaEK?pid=Api&P=0&h=180" },
  
  ];
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  const productosContainer = document.getElementById("productosContainer");
  const contadorCarrito = document.getElementById("contadorCarrito");
  const modalCarrito = new bootstrap.Modal(document.getElementById("modalCarrito"));
  const carritoTabla = document.getElementById("carritoTabla");
  const totalCarrito = document.getElementById("totalCarrito");
  const mensajeCompra = document.getElementById("mensaje-compra");
  
  function cargarProductos() {
    productosContainer.innerHTML = "";
    productos.forEach(prod => {
      const div = document.createElement("div");
      div.className = "col";
      div.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}" loading="lazy" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary">${prod.nombre}</h5>
            <p class="card-text text-success fw-semibold">$${prod.precio.toLocaleString()}</p>
            <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
          </div>
        </div>
      `;
      productosContainer.appendChild(div);
    });
  }
  
  function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
  }
  
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  
  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(i => i.id === id);
    if (item) {
      item.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContador();
  }
  
  function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderCarrito();
  }
  
  function renderCarrito() {
    carritoTabla.innerHTML = "";
    let total = 0;
    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>$${item.precio.toLocaleString()}</td>
        <td>${item.cantidad}</td>
        <td>$${subtotal.toLocaleString()}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
      `;
      carritoTabla.appendChild(tr);
    });
    totalCarrito.textContent = total.toLocaleString();
    actualizarContador();
  }
  
  document.getElementById("verCarrito").addEventListener("click", () => {
    renderCarrito();
    modalCarrito.show();
  });
  
  document.getElementById("cerrarCarrito").addEventListener("click", () => {
    modalCarrito.hide();
  });
  document.getElementById("cerrarCarrito2").addEventListener("click", () => {
    modalCarrito.hide();
  });
  
  document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    carrito = [];
    guardarCarrito();
    renderCarrito();
    modalCarrito.hide();
  
    mensajeCompra.classList.remove("d-none");
    setTimeout(() => {
      mensajeCompra.classList.add("d-none");
    }, 3000);
  });
  
  cargarProductos();
  actualizarContador();