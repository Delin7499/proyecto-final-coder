const socket = io();
let usuario = "";

Swal.fire({
  title: "Ingrese si correo",
  input: "text",
  confirmButtonText: "Ingresar",
}).then((result) => {
  usuario = result.value;
});

const caja = document.getElementById("caja");
const contenido = document.getElementById("contenido");

caja.addEventListener("change", (e) => {
  socket.emit("mensaje", {
    user: usuario,
    message: e.target.value,
  });
  e.target.value = "";
});

socket.on("nuevo_mensaje", (data) => {
  const mensajes = data.map(({ user, message }) => {
    return `<p>${user} dijo ${message}<p>`;
  });

  contenido.innerHTML = mensajes.join(``);
});
