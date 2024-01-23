window.onload = function () {
  fetch('/api/users/profile')
    .then((response) => response.json())
    .then((data) => {
      const profileDoc = data.documents.find(
        (doc) => doc.name === 'ProfilePicture',
      );
      const profilePic = profileDoc
        ? profileDoc.reference
        : '/profiles/default/default.png';

      const adressDoc = data.documents.find(
        (doc) => doc.name === 'ProofOfAddress',
      );
      const adressPic = adressDoc
        ? adressDoc.reference
        : '/profiles/default/default.png';

      const accountDoc = data.documents.find(
        (doc) => doc.name === 'AccountStatus',
      );
      const accountPic = accountDoc
        ? accountDoc.reference
        : '/profiles/default/default.png';

      document.getElementById('email').textContent = data.email;
      document.getElementById('first_name').value = data.first_name;
      document.getElementById('last_name').value = data.last_name;
      document.getElementById('age').textContent = data.age;
      document.getElementById('profilePic').src = profilePic;
      document.getElementById('proof-of-address').src = adressPic;
      document.getElementById('account-status').src = accountPic;
    });
};

document.getElementById('profilePic').addEventListener('click', function () {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('profilePic').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document
  .getElementById('account-status')
  .addEventListener('click', function () {
    document.getElementById('file-account-status').click();
  });

document
  .getElementById('file-account-status')
  .addEventListener('change', function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('account-status').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

document
  .getElementById('proof-of-address')
  .addEventListener('click', function () {
    document.getElementById('file-proof-of-address').click();
  });

document
  .getElementById('file-proof-of-address')
  .addEventListener('change', function () {
    var file = this.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('proof-of-address').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
