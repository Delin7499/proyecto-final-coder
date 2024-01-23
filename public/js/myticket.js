async function fetchAndDisplayTickets() {
  try {
    const ticketsBody = document.getElementById("ticketsBody");
    const userEmail = ticketsBody.getAttribute("data-id");
    console.log(userEmail);
    const apiUrl = `/api/ticket/user/${userEmail}`;
    console.log(apiUrl);

    const response = await fetch(apiUrl);
    const tickets = await response.json();

    ticketsBody.innerHTML = "";

    tickets.forEach((ticket) => {
      const row = ticketsBody.insertRow();
      row.insertCell(0).textContent = ticket.code;
      row.insertCell(1).textContent = new Date(
        ticket.purchase_datetime
      ).toLocaleString();
      row.insertCell(2).textContent = `$${ticket.amount.toFixed(2)}`;
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
}

// Call the function to fetch and display tickets when the page loads
fetchAndDisplayTickets();
