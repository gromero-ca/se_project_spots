import "./index.css";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import { settings } from "../utils/constants.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: process.env.API_TOKEN,
    "Content-Type": "application/json ",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileaAvatarEl.src = userData.avatar;
  })
  .catch(console.error);

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const profile = document.querySelector(".profile");

const newPostBtnClose = newPostModal.querySelector(".modal__close-btn");
const editProfileBtnClose = editProfileModal.querySelector(".modal__close-btn");

const newPostBtnOpen = profile.querySelector(".profile__add-btn");
const editProfileBtnOpen = profile.querySelector(".profile__edit-btn");

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileForm = document.forms["profile-form"];
const newPostForm = document.forms["new-post-form"];

const newPostTitleInput = newPostModal.querySelector("#caption-text-input");
const newPostUrlInput = newPostModal.querySelector("#image-link-input");

const profileNameEl = profile.querySelector(".profile__name");
const profileDescriptionEl = profile.querySelector(".profile__description");
const profileaAvatarEl = profile.querySelector(".profile__avatar");

function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
});

newPostBtnClose.addEventListener("click", function () {
  closeModal(newPostModal);
});

editProfileBtnClose.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtnOpen.addEventListener("click", function () {
  openModal(newPostModal);
});

editProfileBtnOpen.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);
  openModal(editProfileModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = editProfileForm.querySelector(
    settings.submitButtonSelector
  );
  renderLoading(true, submitButton);
  api
    .editUserProfile({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const name = newPostTitleInput.value.trim();
  const link = newPostUrlInput.value.trim();
  const submitButton = newPostForm.querySelector(settings.submitButtonSelector);
  renderLoading(true, submitButton);
  api
    .createCard({ name, link })
    .then((data) => {
      const card = getCardElement(data);
      cardsList.prepend(card);
      newPostForm.reset();
      submitButton.disabled = true;
      submitButton.classList.add(settings.inactiveButtonClass);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard = null;
let selectedCardId = null;

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__btn_cancel");

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);
  const cardRoot = cardElement.querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeIcon = likeButton.querySelector(".card__like-icon");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like-button_active");
    likeIcon.src = "./images/like-red.svg";
  }

  cardImage.addEventListener("click", () => {
    previewCaptionEl.textContent = data.name;
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    openModal(previewModal);
  });

  likeButton.addEventListener("click", () => {
    const cardId = data._id;
    const isLiked = likeButton.classList.contains("card__like-button_active");

    if (isLiked) {
      api
        .dislikeCard(cardId)
        .then((updatedCard) => {
          likeButton.classList.remove("card__like-button_active");
          likeIcon.src = "./images/like.svg";
        })
        .catch(console.error);
    } else {
      api
        .likeCard(cardId)
        .then((updatedCard) => {
          likeButton.classList.add("card__like-button_active");
          likeIcon.src = "./images/like-red.svg";
        })
        .catch(console.error);
    }
  });

  deleteButton.addEventListener("click", () => {
    handleDeleteCard(cardRoot, data);
  });

  return cardElement;
}

const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

previewCloseBtn.addEventListener("click", () => closeModal(previewModal));

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = deleteForm.querySelector(".modal__btn_delete");
  renderLoading(true, submitButton, "Delete", "Deleting...");
  api
    .removeCard(selectedCardId)
    .then(() => {
      if (selectedCard) {
        selectedCard.remove();
      }
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, "Delete");
    });
}

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms["edit-avatar-form"];
const editAvatarInput = editAvatarModal.querySelector("#avatar-link-input");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const profileAvatarContainer = document.querySelector(
  ".profile__avatar-container"
);

editAvatarCloseBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});

profileAvatarContainer.addEventListener("click", () => {
  editAvatarForm.reset();
  resetValidation(editAvatarForm, settings);
  openModal(editAvatarModal);
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatar = editAvatarInput.value;
  const submitButton = editAvatarForm.querySelector(
    settings.submitButtonSelector
  );
  renderLoading(true, submitButton);
  api
    .updateUserProfileAvatar(avatar)
    .then((data) => {
      profileaAvatarEl.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

enableValidation(settings);
