import View from './View';

import iconsURL from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerForClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // this._data is the Model.state.searchResults object.
    const currentPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevBtnMarkup = /* HTML */ `
      <button
        data-goto="${currentPage - 1}"
        class="btn--inline pagination__btn--prev"
      >
        <svg class="search__icon">
          <use href="${iconsURL}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
    `;

    const nextBtnMarkup = /* HTML */ `
      <button
        data-goto="${currentPage + 1}"
        class="btn--inline pagination__btn--next"
      >
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${iconsURL}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    // Page 1, and there are other pages.
    if (currentPage === 1 && numOfPages > 1) {
      return nextBtnMarkup;
    }

    // Last page, and there are other pages.
    if (currentPage === numOfPages && numOfPages > 1) {
      return prevBtnMarkup;
    }

    // Other page.
    if (currentPage < numOfPages) {
      return `${prevBtnMarkup}${nextBtnMarkup}`;
    }

    // Page 1, and there are NO other pages.
    // Or, the default return
    return '';
  }
}

export default new PaginationView();
