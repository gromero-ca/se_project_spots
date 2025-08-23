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

const profileNameEl = profile.querySelector(".profile__name");
const profileDescriptionEl = profile.querySelector(".profile__description");

newPostBtnClose.addEventListener("click", function () {
  newPostModal.classList.remove("modal__is-opened");
});

editProfileBtnClose.addEventListener("click", function () {
  editProfileModal.classList.remove("modal__is-opened");
});

newPostBtnOpen.addEventListener("click", function () {
  newPostModal.classList.add("modal__is-opened");
});

editProfileBtnOpen.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileModal.classList.add("modal__is-opened");
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  editProfileModal.classList.remove("modal__is-opened");
}

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
