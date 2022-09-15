import View from './View';

import iconsURL from 'url:../../img/icons.svg';

class PreviewView extends View {
  _generateMarkup() {
    // this._data is a recipe object
    const curID = window.location.hash.slice(1);

    return /* HTML */ `
      <li class="preview">
        <a
          class="preview__link ${this._data.id === curID
            ? 'preview__link--active'
            : ''}"
          href="#${this._data.id}"
        >
          <figure class="preview__fig">
            <img src="${this._data.imageURL}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div
              class="preview__user-generated ${this._data.key ? '' : 'hidden'}"
            >
              <svg>
                <use href="${iconsURL}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
