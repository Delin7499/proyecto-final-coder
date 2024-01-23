const emailInput = document.getElementById("email");
console.log(emailInput.value);
document.getElementById("send-button").addEventListener("click", function () {
  fetch("/api/users/recover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      document.getElementById("resultContainer").innerHTML = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
