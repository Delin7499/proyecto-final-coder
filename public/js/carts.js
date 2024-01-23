const socket = io();

const carritosContainer = document.getElementById("carts");

socket.on("carts", (carritos) => {
  const carritoslist = carritos.map((cart) => {
    const productos = cart.products.map(
      (prod) =>
        `<li>
        <p>Quantity ${prod.quantity}</p>
        <p>Product ID: ${prod.product._id}</p>
        </li>`
    );
    productosString = productos.join("");
    console.log(productosString);

    return `<li>
            <h2>Id: ${cart._id}</h2>
            <ul>${productosString}</ul>
            </li>`;
  });

  carritosContainer.innerHTML = `<ul>${carritoslist.join("")}</ul>`;
});

const form = document.querySelector("#productForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const formData = {
    cartId: document.querySelector("#cartId").value,
    productId: document.querySelector("#productId").value,
  };
  fetch(`/api/carts/${formData.cartId}/product/${formData.productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.error("Error:", error);
  });
});

const formcarrito = document.querySelector("#cartForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  fetch(`/api/carts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.error("Error:", error);
  });
});
