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
    document.getElementById('first_name').textContent = data.first_name;
    document.getElementById('last_name').textContent = data.last_name;
    document.getElementById('age').textContent = data.age;
    document.getElementById('role').textContent = data.role;
    document.getElementById('profilePic').src = profilePic;
    document.getElementById('addressPic').src = adressPic;
    document.getElementById('accountPic').src = accountPic;
  });
