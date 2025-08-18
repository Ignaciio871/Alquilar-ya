// Lista de productos simulada
const productos = [
    { id: 1, nombre: "Producto A", precio: 100, img: "https://via.placeholder.com/150" },
    { id: 2, nombre: "Producto B", precio: 200, img: "https://via.placeholder.com/150" },
    { id: 3, nombre: "Producto C", precio: 300, img: "https://via.placeholder.com/150" }
  ];
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  // Cargar productos
  const contenedorProductos = document.getElementById("productosContainer");
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
  
  function actualizarContador() {
    document.getElementById("contadorCarrito").textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
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
    const tbody = document.getElementById("carritoTabla");
    tbody.innerHTML = "";
    let total = 0;
    carrito.forEach(item => {
      const fila = document.createElement("tr");
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>$${item.precio}</td>
        <td>${item.cantidad}</td>
        <td>$${subtotal}</td>
        <td><button onclick="eliminarDelCarrito(${item.id})">❌</button></td>
      `;
      tbody.appendChild(fila);
    });
    document.getElementById("totalCarrito").textContent = total;
    actualizarContador();
  }
  
  // Modal carrito
  const modal = document.getElementById("modalCarrito");
  document.getElementById("verCarrito").addEventListener("click", () => {
    renderCarrito();
    modal.style.display = "block";
  });
  document.getElementById("cerrarCarrito").addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  // Finalizar compra
  document.getElementById("finalizarCompra").addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    alert("Compra finalizada con éxito");
    carrito = [];
    guardarCarrito();
    renderCarrito();
    modal.style.display = "none";
  });
  
  // Iniciar
  actualizarContador();
  