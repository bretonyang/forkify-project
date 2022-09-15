import View from './View';
import PreviewView from './PreviewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again!';
  _message = 'Results successful loaded';

  _generateMarkup() {
    // this._data is an array of result objects
    return this._data
      .map((result) => PreviewView.render(result, false))
      .join('');
  }
}

export default new ResultsView();
