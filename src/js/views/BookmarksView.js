import View from './View';
import PreviewView from './PreviewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Find a recipe and bookmark it!';
  _message = 'Bookmark successfully added';

  addHandlerForRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // this._data is an array of bookmark objects
    return this._data
      .map((bookmark) => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
