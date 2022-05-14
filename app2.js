let persons = [
  {
    firstName: 'Marko',
    lastName: 'Markovic',
    dateOfBirth: new Date(1990/04/12),
  },
];



const containerDiv = document.getElementById('container');

const showAddPersonForm = () => {
  containerDiv.innerHTML = `<form onsubmit="addPerson(event)">
                                <input type="text" placeholder="First Name" id="first-name-input">
                                <input type="text" placeholder="Last Name" id="last-name-input">
                                <input type="date" id="date-input">
                                <input type="submit" value="Add Person">
                              </form>
                              <button onclick=showPersons() style="margin: 1rem;">Show Persons List</button>
                              `;
};

///
const showEditPersonForm = () => {
  containerDiv.innerHTML = `<form onsubmit="editPerson(event)">
                                <input type="text" placeholder="First Name" id="first-name-input">
                                <input type="text" placeholder="Last Name" id="last-name-input">
                                <input type="date" id="date-input">
                                <input type="submit" value="Edit Person" id="editPersonBtn">
                              </form>`;
};

const showPersons = () => {
  containerDiv.innerHTML = '';
  let id = 0;

  containerDiv.innerHTML += `<table class="" width="100%" cellpadding=10 border=1 style="border-collapse: collapse; table-layout: fixed; border:2px solid black;"> 
      <tr>
      <th>Ime</th>
      <th>Prezime</th>
      <th>Datum rodjenja</th>
      </tr>
      <tbody id="personData"></tbody>`;

  const tablePersonData = document.getElementById('personData');
  let dataHtml = '';

  persons.forEach((person) => {
    id++; /// id
    person.id = `id${id}`; // kasnije cu porediti vrijednost ovog atributa sa event.target klasom koja ima isti format
    dataHtml += `
      <tr class="id${id}">
      <td>${person.firstName}</td>
      <td>${person.lastName}</td>
      <td>${person.dateOfBirth}</td>
      <td style="background-color: #e5f3de"><button onclick=editPersons(event) class="id${id}">Izmijeni</button></td>
      <td style="background-color: pink"><button onclick=removePersons(event) class="id${id}">Ukloni</button></td>
      </tr>
      `;
  });

  tablePersonData.innerHTML = dataHtml;
  containerDiv.innerHTML += `<button onclick=showAddPersonForm() style="margin: 1rem;">Add Person</button>`;
};

const login = (event) => {
  event.preventDefault();

  let username = document.getElementById('username-input').value.trim();
  let password = document.getElementById('password-input').value.trim();

  if (username.length > 3 && password.length > 6) {
    sessionStorage.setItem('loggedIn', '1');
    sessionStorage.setItem('persons', JSON.stringify(persons)); /// ****
    showPersons();
  } else {
    if (!document.getElementById('login-error-message')) {
      containerDiv.innerHTML += `<p id="login-error-message" style="color: red">Wrong credentials</p>`;
    }
  }
};

const addPerson = (event) => {
  event.preventDefault();

  let firstName = document.getElementById('first-name-input').value.trim();
  let lastName = document.getElementById('last-name-input').value.trim();
  let dateOfBirth = document.getElementById('date-input').value;

  if (firstName !== '' && lastName !== '' && dateOfBirth !== '') {
    persons.push({
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
    });

    sessionStorage.setItem('persons', JSON.stringify(persons));
  }
  showPersons();
};

// funkcija za editovanje tabele i session storage-a

const editPersons = (event) => {
  event.preventDefault();

  showEditPersonForm();

  let targetId = event.target.className;

  persons.forEach((singlePerson) => {
    if (targetId == singlePerson.id) {
      // ako je naziv klase dobijen putem event.target jednak ID atributu persons objekta ONDA JE TO TRAZENI objekat

      let targetIndex = persons.indexOf(singlePerson);

      const firstNameInp = document.getElementById('first-name-input');
      const lastNameNameInp = document.getElementById('last-name-input');
      const dateOfBirthInp = document.getElementById('date-input');

      firstNameInp.value = persons[`${targetIndex}`].firstName; //ime dinamicki popunjeno
      lastNameNameInp.value = persons[`${targetIndex}`].lastName; //lastName
      dateOfBirthInp.value = persons[`${targetIndex}`].dateOfBirth; // dinamicki datum osobe koja je selektovana

      const editTargetPerson = (event) => {
        // za svaku osobu u nizu koja ispunjava prethodni uslov
        event.preventDefault();

        const targetPerson = persons[`${targetIndex}`];

        console.log(targetPerson);

        let firstName = firstNameInp.value.trim();
        let lastName = lastNameNameInp.value.trim();
        let dateOfBirth = dateOfBirthInp.value;

        if (firstName !== '' && lastName !== '' && dateOfBirth !== '') {
          targetPerson.firstName = firstName;
          console.log(targetPerson.firstName);
          targetPerson.lastName = lastName;
          targetPerson.dateOfBirth = dateOfBirth;
        }

        console.log(targetPerson.firstName);

        let tmpPersons = JSON.parse(sessionStorage.getItem('persons'));
        tmpPersons[targetIndex].firstName = targetPerson.firstName;

        console.log(tmpPersons[targetIndex].firstName);

        tmpPersons[`${targetIndex}`].lastName = targetPerson.lastName;
        tmpPersons[`${targetIndex}`].dateOfBirth = targetPerson.dateOfBirth;

        sessionStorage.setItem('persons', JSON.stringify(tmpPersons));

        showPersons();
      };
      const editPersonBtn = document.getElementById('editPersonBtn');
      const editPersonHandler = editPersonBtn.addEventListener(
        'click',
        editTargetPerson
      );
    }
  });
};

// funkcija za uklanjanje itema iz tabele i session storage-a

const removePersons = (event) => {
  event.preventDefault();

  let confirmation = confirm(
    'Da li ste sigurni da želite izbrisati ovaj unos?'
  );

  if (confirmation) {
    let targetId = event.target.className;

    persons.forEach((singlePerson) => {
      if (targetId == singlePerson.id) {
        // ako je naziv klase dobijen putem event.target jednak ID atributu persons objekta ONDA JE TO TRAZENI objekat

        let targetIndex = persons.indexOf(singlePerson);

        let toBeDeleted = document.querySelectorAll(`.${targetId}`); // svi elementi za brisanje selektovani sa querySelectorAll
        toBeDeleted.forEach((element) => {
          element.remove();
          console.log(element);
        });
        persons.splice(targetIndex, 1); // brisemo element sa ciljanim indexom koji se dobija dinamicki

        let tmpPersons = JSON.parse(sessionStorage.getItem('persons'));
        tmpPersons.splice(targetIndex, 1);
        sessionStorage.setItem('persons', JSON.stringify(tmpPersons));
      }
    });
    // let targetIdNumber = targetId.replace(/[^0-9]/g, ''); // regex kojim uklanjamo sve osim broja npr. id8 postaje 8
  }
};


if (sessionStorage.getItem('loggedIn')) {
  let personsStr = sessionStorage.getItem('persons');
  persons = personsStr ? JSON.parse(personsStr) : persons;
  showPersons();
}