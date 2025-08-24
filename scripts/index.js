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
const editProfileForm = editProfileModal.querySelector(".modal__form");
const newPostForm = newPostModal.querySelector(".modal__form");

const newPostTitleInput = newPostModal.querySelector("#caption-text-input");
const newPostUrlInput = newPostModal.querySelector("#image-link-input");

const profileNameEl = profile.querySelector(".profile__name");
const profileDescriptionEl = profile.querySelector(".profile__description");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

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
  openModal(editProfileModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  console.log(newPostTitleInput.value);
  console.log(newPostUrlInput.value);
  closeModal(newPostModal);
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
