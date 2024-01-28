const usersContainer = document.getElementById('users');

const fetchUsers = (limit, page, sort) => {
  const fetchUrl = '/api/users';

  fetch(fetchUrl)
    .then((response) => response.json())
    .then((users) => {
      const productoslist = users.map((user) => {
        const date = new Date(user.lastConnection);
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        const formattedDate = date.toLocaleDateString(undefined, options);

        return ` <div class="h-auto md:w-64 hover:shadow-md bg-white group relative rounded-md flex flex-col">
    
        <div class="p-4">
          <h3 class="text-sm text-gray-700">
              ${user.first_name} 
          </h3>
          <p class="text-sm text-gray-500">Email: ${user.email}</p>
          <p class="text-sm text-gray-500">Role: ${user.role}</p>
          <p class="text-sm text-gray-500">Last Connection: ${formattedDate}</p>
        
          <button class="delete-product-button flex-auto relative self-center bg-blue-400 rounded-md hover:bg-blue-600" data-user-email="${user.email}">Delete</button>
        </div>
      </div>`;
      });

      usersContainer.innerHTML = productoslist.join('');
      setupDeleteButtons();
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
};

function setupDeleteButtons() {
  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-product-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const userEmail = button.getAttribute('data-user-email');

      // Send a delete request to your server
      fetch(`/api/users/${userEmail}`, {
        method: 'DELETE',
      })
        .then(() => {
          Swal.fire({
            icon: 'success',
            text: 'User deleted successfully!',
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    });
  });
}

if (usersContainer) {
  fetchUsers();
}

const deleteInactive = document.getElementById('deleteInactive');

deleteInactive.addEventListener('click', () => {
  fetch(`/api/users/`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        Swal.fire({
          text: 'No inactive users found!',
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        const emails = data.map((user) => {
          return `${user.email} `;
        });
        Swal.fire({
          icon: 'success',
          text: `Inactive users deleted successfully! (${emails})`,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
});
