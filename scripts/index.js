const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const profile = document.querySelector(".profile");

const newPostBtnClose = newPostModal.querySelector(".modal__close-btn");
const editProfileBtnClose = editProfileModal.querySelector(".modal__close-btn");

const newPostBtnOpen = profile.querySelector(".profile__add-btn");
const editProfileBtnOpen = profile.querySelector(".profile__edit-btn");

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
  editProfileModal.classList.add("modal__is-opened");
});
