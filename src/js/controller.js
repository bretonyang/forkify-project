import * as Model from './model';
import RecipeView from './views/RecipeView';
import SearchView from './views/SearchView';
import ResultsView from './views/ResultsView';
import PaginationView from './views/PaginationView';
import BookmarksView from './views/BookmarksView';
import AddRecipeView from './views/AddRecipeView';

import { MODAL_CLOSE_SECONDS } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    // 1. Get recipe id (slice from 1 to remove '#')
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1. Render spinner
    RecipeView.renderSpinner();

    // 2. Update results view to mark selected result
    ResultsView.update(Model.getSearchResultsByPage());

    // 3. Update bookmarks view
    BookmarksView.update(Model.state.bookmarks);

    // 4. Loading recipe
    await Model.loadRecipe(id);

    // 5. Rendering recipe
    RecipeView.render(Model.state.recipe);
  } catch (error) {
    RecipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2. Render spinner
    ResultsView.renderSpinner();

    // 3. Load search results
    await Model.loadSearchResults(query);

    // 4. Render results by page
    const resultsAtPage = Model.getSearchResultsByPage();
    ResultsView.render(resultsAtPage);

    // 5. Render initial pagination buttons
    PaginationView.render(Model.state.searchResults);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results by page
  const resultsAtPage = Model.getSearchResultsByPage(goToPage);
  ResultsView.render(resultsAtPage);

  // Render NEW pagination buttons
  PaginationView.render(Model.state.searchResults);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  Model.updateServings(newServings);

  // Update the recipe view
  // RecipeView.render(Model.state.recipe);
  RecipeView.update(Model.state.recipe);
};

const controlBookmarks = function () {
  // 1. Add/Delete bookmark
  if (!Model.state.recipe.bookmarked) {
    Model.addBookmark(Model.state.recipe);
  } else {
    Model.deleteBookmark(Model.state.recipe.id);
  }

  // 2. Update recipe View
  RecipeView.update(Model.state.recipe);

  // 3. Render bookmarks
  BookmarksView.render(Model.state.bookmarks);
};

const initializeBookmarks = function () {
  BookmarksView.render(Model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    AddRecipeView.renderSpinner();

    // Upload new recipe
    await Model.uploadRecipe(newRecipe);

    // Render recipe
    RecipeView.render(Model.state.recipe);

    // Display success message
    AddRecipeView.renderMessage();

    // Render bookmark view
    BookmarksView.render(Model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${Model.state.recipe.id}`);

    // Close form modal (after some time)
    setTimeout(() => {
      AddRecipeView.toggleModal();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (error) {
    console.error('💥', error);
    AddRecipeView.renderError(error.message);
  }
};

const newFeature = function () {
  console.log('Welcome to forkify app!');
};

const init = function () {
  BookmarksView.addHandlerForRender(initializeBookmarks);
  RecipeView.addHandlerForRender(controlRecipes);
  RecipeView.addHandlerForUpdateSevings(controlServings);
  RecipeView.addHandlerForBookmarks(controlBookmarks);
  SearchView.addHandlerForSearch(controlSearchResults);
  PaginationView.addHandlerForClick(controlPagination);
  AddRecipeView.addHandlerForUpload(controlAddRecipe);
  newFeature();
};
init();
