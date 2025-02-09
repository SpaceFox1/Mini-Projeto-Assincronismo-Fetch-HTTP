const cardContainer = document.getElementById('places');
const modal = document.getElementById('placeModal');
const modalTitle = document.getElementById('modalTitle');
const modalMainActionButtonLabel = document.getElementById('modalMainActionButtonLabel');
const modalMainActionButton = document.getElementById('submitModalFormButton');
const modalInputs = {
  name: document.getElementById('placeTitleInput'),
  picture: document.getElementById('placePictureInput'),
  description: document.getElementById('placeDescriptionInput'),
}

const backendURL = 'http://localhost:3000';

// function to be runned when the main button on the modal is pressed
let mainModalActionToRun = null;

/*
const data = fetch(`${backendURL}/api/places`, {
    method: 'get',
    body: JSON.stringify({
      id: '827501a8-2e0d-4acd-9f55-ccaafda2a013',
      // name: 'Banana',
      // description: 'teste 2',
      // picture: 'https://examplo.com'
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
*/

async function deletePlace(placeData) {
  return new Promise((resolve, reject) => {
    fetch(`${backendURL}/api/deletePlace`, {
      method: 'delete',
      body: JSON.stringify({
        id: placeData.id,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    }).then((req) => {
      if (req.status < 400)return resolve();
      else reject(req.text);
    });
  })
}

function openModal(modalTitleTxt, modalActionName) {
  document.body.style.overflowY = 'hidden';
  modal.style.display = 'flex';
  modalTitle.innerText = modalTitleTxt;
  modalMainActionButtonLabel.innerText = modalActionName;
}

function createUIPlace(placeObject) {
  // card box
  const card = document.createElement('div');
  card.classList.add('placeCard');
  card.classList.add('loading');

  // image box
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('cardImageContainer');

  // image
  const img = document.createElement('img');
  imageContainer.appendChild(img);

  const imgSpinner = document.createElement('div');
  imgSpinner.classList.add('spinner');
  imageContainer.appendChild(imgSpinner);

  // add image box to card box
  card.appendChild(imageContainer);

  // content box
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cardContent');

  // title
  const title = document.createElement('h3');
  title.classList.add('cardTitle');
  title.innerText = placeObject.title;
  contentContainer.appendChild(title);

  // Description
  const description = document.createElement('p');
  description.classList.add('cardDescription');
  description.innerText = placeObject.description;
  contentContainer.appendChild(description);

  // add content box to card box
  card.appendChild(contentContainer);

  // buttons box
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('cardButtonsContainer');

  // edit button
  const editButton = document.createElement('button');
  editButton.classList.add('cardButton');
  editButton.innerText = 'Editar';
  editButton.onclick = () => {
    openModal(`Editar '${placeObject.title}'`, 'Editar');
    modalInputs.name.value = placeObject.title;
    modalInputs.description.value = placeObject.description;
    modalInputs.picture.value = placeObject.picture;
    mainModalActionToRun = async () => {
      return new Promise((resolve, reject) => {
        fetch(`${backendURL}/api/editPlace`, {
          method: 'PATCH',
          body: JSON.stringify({
            id: placeObject.id,
            name: modalInputs.name.value,
            description: modalInputs.description.value,
            picture: modalInputs.picture.value
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }).then((data) => data.json()).then((data) => {
          card.classList.add('loading');
          title.innerText = data.title;
          description.innerText = data.description;
          img.src = undefined;
          fetch(data.picture).then((data) => data.blob()).then((imageBlob) => {
            img.src = URL.createObjectURL(imageBlob);
            card.classList.remove('loading');
            resolve();
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }
  }
  buttonsContainer.appendChild(editButton);

  // delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cardButton');
  deleteButton.onclick = async () => {
    deleteButton.classList.add('loading');
    deletePlace(placeObject).then(() => {
      card.remove();
    }).catch((err) => {
      console.error(err);
    });
  }
  // delete button spinner
  const deleteButtonSpinner = document.createElement('div');
  deleteButtonSpinner.classList.add('spinner');
  deleteButton.appendChild(deleteButtonSpinner);
  
  // delete button text
  const deleteButtonText = document.createElement('span');
  deleteButtonText.innerText = 'Deletar';
  deleteButton.appendChild(deleteButtonText);
  
  // add delete button to buttons box
  buttonsContainer.appendChild(deleteButton);

  card.appendChild(buttonsContainer);

  cardContainer.appendChild(card);

  fetch(placeObject.picture).then((data) => data.blob()).then((imageBlob) => {
    img.src = URL.createObjectURL(imageBlob);
    card.classList.remove('loading');
  });
}

function fetchPlaces() {
  fetch(`${backendURL}/api/places`).then(data => data.json()).then((places) => {
    places.forEach((element) => {
      createUIPlace(element);
    });
  });
}

function startCreatingNewPlace() {
  openModal('Criar Beleza Paraibana', 'Criar');
  mainModalActionToRun = async () => {
    return new Promise((resolve, reject) => {
      fetch(`${backendURL}/api/newPlace`, {
        method: 'put',
        body: JSON.stringify({
          name: modalInputs.name.value,
          description: modalInputs.description.value,
          picture: modalInputs.picture.value
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then((data) => data.json()).then((data) => {
        createUIPlace(data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  };
}

function cancelModal() {
  document.body.style.overflowY = 'auto';
  modal.style.display = 'none';
  modalInputs.name.value = '';
  modalInputs.picture.value = '';
  modalInputs.description.value = '';
  modalMainActionButton.classList.remove('loading');
  mainModalActionToRun = null;
}

function modalMainAction() {
  modalMainActionButton.classList.add('loading');
  if (mainModalActionToRun) {
    mainModalActionToRun().then(() => {
      cancelModal();
    });
  }
}

fetchPlaces();