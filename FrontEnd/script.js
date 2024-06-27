let works = [];
let categories = [];

// login

const token = localStorage.getItem("token");

// logout

const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
};

// fermer la modale

const closeModal = () => {
  const mainModal = document.querySelector(".mainModal");
  mainModal.innerHTML = "";
};
// pour supprimer un projet
const deleteWork = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(async (response) => {
    if (response.ok) {
      await getWorks();
      generateFirstModalContent();
    }
  });
};
// si on veut rajouter un projet il faudra remplir tous les champs
const addWork = () => {
  const file = document.querySelector("#file");
  const title = document.querySelector("#title");
  const category = document.querySelector("#category");
  if (!file.files[0] || !title.value || !category.value) {
    return alert("veuillez remplir tous les champs");
  }
  const formData = new FormData();
  formData.append("image", file.files[0]);
  formData.append("title", title.value);
  formData.append("category", category.value);
  fetch(`http://localhost:5678/api/works`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  }).then(async (response) => {
    if (response.ok) {
      await getWorks();
      generateModalPhoto();
    }
  });
};

// première partie modale

const generateFirstModalContent = () => {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";
  const closeIconContainer = document.createElement("span");
  closeIconContainer.addEventListener("click", closeModal);
  const closeIcon = document.createElement("i");
  closeIcon.className = "fa-solid fa-xmark";
  closeIconContainer.appendChild(closeIcon);
  const titleModal = document.createElement("h1");
  titleModal.innerHTML = "Galerie photo";
  titleModal.className = "titleModal";
  modalContent.appendChild(titleModal);
  const galleryModal = document.createElement("div");
  galleryModal.className = "galleryModal";
  modalContent.appendChild(galleryModal);
  modalContent.appendChild(closeIconContainer);
  const modalWorksContainer = document.createElement("div");
  modalWorksContainer.className = "modalWorksContainer";

  // galerie d'images

  for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure");
    figure.className = "modalWork";
    const img = document.createElement("img");
    img.src = works[i].imageUrl;
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.addEventListener("click", () => deleteWork(works[i].id));
    figure.appendChild(trash);
    figure.appendChild(img);
    modalWorksContainer.appendChild(figure);
  }
  galleryModal.appendChild(modalWorksContainer);

  const barModal = document.createElement("div");
  barModal.className = "barModal";
  modalContent.appendChild(barModal);
  const button = document.createElement("button");
  button.innerHTML = "Ajouter une photo";
  button.className = "addphoto";
  modalContent.appendChild(button);
  button.addEventListener("click", generateModalPhoto);
};

// deuxième partie modale
const generateModalPhoto = () => {
  const modalContent = document.querySelector(".modalContent");
  modalContent.innerHTML = "";

  const containerModalPhoto = document.createElement("div");
  containerModalPhoto.className = "containerModalPhoto";
  const modalAddPhoto = document.createElement("div");
  modalAddPhoto.className = "modalAddPhoto";

  containerModalPhoto.appendChild(modalAddPhoto);

  const closeIconContainer = document.createElement("span");
  closeIconContainer.addEventListener("click", closeModal);
  const closeIcon = document.createElement("i");
  closeIcon.className = "fa-solid fa-xmark";
  closeIconContainer.appendChild(closeIcon);
  modalAddPhoto.appendChild(closeIconContainer);

  const arrowIconContainer = document.createElement("span");
  const arrowIcon = document.createElement("i");
  arrowIcon.className = "fa-solid fa-arrow-left";
  arrowIconContainer.appendChild(arrowIcon);
  modalAddPhoto.appendChild(arrowIconContainer);
  arrowIconContainer.addEventListener("click", generateFirstModalContent);

  const titleModal = document.createElement("h2");
  titleModal.innerHTML = "Ajout photo";
  titleModal.className = "add";
  modalAddPhoto.appendChild(titleModal);

  const previewPhoto = document.createElement("form");
  previewPhoto.className = "previewPhoto";
  modalAddPhoto.appendChild(previewPhoto);

  const containerFile = document.createElement("div");
  containerFile.className = "containerFile";
  previewPhoto.appendChild(containerFile);

  const textCategory = document.createElement("div");
  textCategory.className = "textCategory";
  previewPhoto.appendChild(textCategory);

  const barModal = document.createElement("div");
  barModal.className = "barModal";
  modalAddPhoto.appendChild(barModal);
  const button = document.createElement("button");
  button.innerHTML = "Valider";
  button.className = "validate";
  button.addEventListener("click", addWork);
  modalAddPhoto.appendChild(button);

  const imageIconContainer = document.createElement("span");
  const imageIcon = document.createElement("i");
  imageIcon.className = "fa-regular fa-image";
  imageIconContainer.appendChild(imageIcon);
  containerFile.appendChild(imageIconContainer);

  const fileLabel = document.createElement("label");

  fileLabel.htmlFor = "file";
  const addPictureText = document.createElement("div");
  addPictureText.innerHTML = "+ Ajouter photo";
  addPictureText.className = "file";
  fileLabel.appendChild(addPictureText);
  const fileInput = document.createElement("input");

  fileInput.type = "file";
  fileInput.id = "file";
  fileInput.name = "image";

  const previewImg = document.createElement("img");
  previewImg.className = "preview";
  previewImg.src = "#";
  previewImg.alt = "Aperçu de l'image";
  const pFile = document.createElement("p");
  pFile.innerHTML = "jpg, png : 4mo max";
  fileLabel.appendChild(previewImg);
  containerFile.appendChild(fileLabel);
  containerFile.appendChild(fileInput);
  containerFile.appendChild(pFile);

  const titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Titre";
  textCategory.appendChild(titleLabel);
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.name = "title";
  titleLabel.appendChild(titleInput);
  const category = document.createElement("label");
  category.innerHTML = "Catégorie";
  textCategory.appendChild(category);
  const select = document.createElement("select");
  select.name = "category";
  select.id = "category";
  category.appendChild(select);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categoryOption = document.createElement("option");
    categoryOption.innerHTML = category.name;
    categoryOption.value = category.id;
    select.appendChild(categoryOption);
  }
  modalContent.appendChild(modalAddPhoto);

  // prévisualisation de l'image

  fileInput.addEventListener("change", (evt) => {
    const [file] = fileInput.files;
    console.log(file);
    const size = fileInput.files[0].size;
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      alert("Le fichier n'est pas du type jpg ou png");
    } else if (size > 4000000) {
      alert("image trop volumineuse");
    } else {
      if (file) {
        previewImg.src = URL.createObjectURL(file);
      }

      previewImg.className = "previewActif";
      fileLabel.className = "fileLabel";
      imageIcon.style.display = "none";
      addPictureText.style.display = "none";
      pFile.style.display = "none";
      if (file && titleInput.value && select.value) {
        button.className = "validateActif";
      }
    }
  });
  titleInput.addEventListener("change", (evt) => {
    const [file] = fileInput.files;
    if (file && titleInput.value && select.value) {
      button.className = "validateActif";
    }
  });
  select.addEventListener("change", (evt) => {
    const [file] = fileInput.files;
    if (file && titleInput.value && select.value) {
      button.className = "validateActif";
    }
  });
};
// partie modale
const generateModal = () => {
  const mainModal = document.querySelector(".mainModal");
  const modalContainer = document.createElement("div");
  modalContainer.className = "containerModal";
  modalContainer.addEventListener("click", closeModal);
  const modalContent = document.createElement("div");
  modalContent.className = "modalContent";
  modalContent.addEventListener("click", (e) => e.stopPropagation());
  modalContainer.appendChild(modalContent);
  mainModal.appendChild(modalContainer);
  generateFirstModalContent();
};

// connexion et déconnexion

if (token) {
  const authButton = document.querySelector(".auth-button");
  authButton.innerHTML = "";
  const logoutButton = document.createElement("a");
  logoutButton.innerHTML = "logout";
  logoutButton.addEventListener("click", logoutUser);
  authButton.appendChild(logoutButton);

  // création de la barre édition

  const topBarContainer = document.querySelector(".top-bar-container");
  const topBarEdition = document.createElement("div");
  topBarEdition.className = "top-bar-edition";
  const editionBtn = document.createElement("div");
  editionBtn.className = "edition-btn";
  const penToSquare = document.createElement("i");
  penToSquare.className = "fa-regular fa-pen-to-square";
  const editionText = document.createElement("span");
  editionText.innerHTML = "mode édition";
  topBarContainer.appendChild(topBarEdition);
  topBarEdition.appendChild(editionBtn);
  editionBtn.appendChild(penToSquare);
  editionBtn.appendChild(editionText);

  // création du bouton modifier

  const projetTitle = document.querySelector("#portfolio h2");
  const modifButton = document.createElement("a");
  modifButton.className = "modif_button";
  modifButton.addEventListener("click", generateModal);
  const faPenToSquare = document.createElement("i");
  faPenToSquare.className = "fa-regular fa-pen-to-square";
  const modifText = document.createElement("span");
  modifText.innerHTML = "modifier";
  modifButton.appendChild(faPenToSquare);
  modifButton.appendChild(modifText);
  projetTitle.appendChild(modifButton);
}

const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");

// galerie

const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  if (!response.ok) {
    return alert(
      "une erreur s'est produite lors de la récupération des travaux"
    );
  } else {
    const data = await response.json();
    works = data;
    displayWorks(0);
  }
};

const displayWorks = (categoryId) => {
  let filteredWorks = [];
  if (categoryId === 0) {
    filteredWorks = works;
  } else {
    filteredWorks = works.filter((work) => work.categoryId === categoryId);
  }
  gallery.innerHTML = "";
  for (let i = 0; i < filteredWorks.length; i++) {
    const work = filteredWorks[i];
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
};
// filtres
const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  if (!response.ok) {
    return alert(
      "une erreur s'est produite lors de la récupération des catégories"
    );
  } else {
    const data = await response.json();
    categories = data;
    if (!token) {
      displayCategories();
    }
  }
};
// récupération de chaque partie filtres

const displayCategories = () => {
  let filteredCategories = [...categories];

  filteredCategories.push({
    id: 0,
    name: "Tous",
  });

  filteredCategories.sort((a, b) => a.id - b.id);

  for (let i = 0; i < filteredCategories.length; i++) {
    const category = filteredCategories[i];
    const button = document.createElement("button");
    button.innerHTML = category.name;
    button.addEventListener("click", () => displayWorks(category.id));
    filters.appendChild(button);
  }
};

getCategories();
getWorks();
