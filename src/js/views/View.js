import iconsURL from 'url:../../img/icons.svg';

class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {Boolean} [render=true] If false, return markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View object
   * @author Breton Yang
   * @TODO Fix small bugs mentioned in note.md
   */
  render(data, shouldRender = true) {
    if (this.#isInvalid(data)) {
      this.renderError();
      return;
    }

    this._data = data;
    const markup = this._generateMarkup();

    // Return markup if we should NOT render
    if (!shouldRender) return markup;

    this.#clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Do NOT need to render error when there's no data yet.
    if (this.#isInvalid(data)) return;

    // Store data and generate markup with the new data
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Create new DOM to compare the elements with isEqualNode()
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Loop through newElements and curElements
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = /* HTML */ `
      <div class="spinner">
        <svg>
          <use href="${iconsURL}#icon-loader"></use>
        </svg>
      </div>
    `;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = /* HTML */ `
      <div class="error">
        <div>
          <svg>
            <use href="${iconsURL}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = /* HTML */ `
      <div class="message">
        <div>
          <svg>
            <use href="${iconsURL}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clearHTML() {
    this._parentElement.innerHTML = '';
  }

  #isInvalid(data) {
    const isEmptyArray = Array.isArray(data) && !data.length;
    return !data || isEmptyArray;
  }
}

export default View;
