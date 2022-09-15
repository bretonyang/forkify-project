import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded ✅';

  #modal = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.#addHandlerForShowModal();
    this.#addHandlerForHideModal();
  }

  addHandlerForUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // Getting submitted form data
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  toggleModal() {
    this.#modal.classList.toggle('hidden');
    this.#overlay.classList.toggle('hidden');
  }

  #addHandlerForShowModal() {
    this.#btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  #addHandlerForHideModal() {
    this.#btnClose.addEventListener('click', this.toggleModal.bind(this));
    this.#overlay.addEventListener('click', this.toggleModal.bind(this));
  }
}

export default new AddRecipeView();
