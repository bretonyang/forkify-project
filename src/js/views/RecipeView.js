import View from './View';

import iconsURL from 'url:../../img/icons.svg';
import fracty from 'fracty';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'Could not find the recipe. Please try another one!';
  _message = 'Recipe successful loaded';

  addHandlerForRender(handler) {
    ['hashchange', 'load'].forEach((eventName) => {
      window.addEventListener(eventName, handler);
    });
  }

  addHandlerForUpdateSevings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const updateTo = Number(btn.dataset.updateTo);
      if (updateTo < 1) return;

      handler(updateTo);
    });
  }

  addHandlerForBookmarks(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    // this._data is a recipe object
    return /* HTML */ `
      <figure class="recipe__fig">
        <img
          src="${this._data.imageURL}"
          alt="${this._data.title}"
          class="recipe__img"
        />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${iconsURL}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">
            ${this._data.cookingTime}
          </span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${iconsURL}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">
            ${this._data.servings}
          </span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button
              class="btn--tiny btn--update-servings"
              data-update-to="${this._data.servings - 1}"
            >
              <svg>
                <use href="${iconsURL}#icon-minus-circle"></use>
              </svg>
            </button>
            <button
              class="btn--tiny btn--update-servings"
              data-update-to="${this._data.servings + 1}"
            >
              <svg>
                <use href="${iconsURL}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${iconsURL}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use
              href="${iconsURL}#icon-bookmark${this._data.bookmarked
                ? '-fill'
                : ''}"
            ></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map((ing) => this.#generateMarkupIngredient(ing))
            .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please
          check out directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceURL}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${iconsURL}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  #generateMarkupIngredient(ing) {
    return /* HTML */ `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${iconsURL}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">
          ${ing.quantity ? fracty(ing.quantity).toString() : ''}
        </div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeView();
