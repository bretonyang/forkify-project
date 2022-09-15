import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

////////////////////////////////////////
// Small Helpers

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const createRecipeObject = function (data) {
  // Create recipe object with our own custom property name.
  const { recipe } = data.data;

  // Use trick to conditionally add "key" property.
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    imageURL: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

////////////////////////////////////////
// Exported Functions

export const state = {
  recipe: {},
  searchResults: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    const isInBookmarks = state.bookmarks.some(
      (bookmark) => bookmark.id === id
    );
    state.recipe.bookmarked = isInBookmarks ? true : false;
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.searchResults.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.searchResults.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageURL: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.searchResults.page = 1;
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export const getSearchResultsByPage = function (
  page = state.searchResults.page
) {
  state.searchResults.page = page;

  const start = (page - 1) * state.searchResults.resultsPerPage;
  const end = page * state.searchResults.resultsPerPage;

  return state.searchResults.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add bookmark to bookmarks array
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark with given id
  const index = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // Store ingredient objects inside newRecipe into an ingredients array
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        // [" quantity", "bags of ", "tomato sauce and shrimp"]
        const ingArr = ing[1].split(',').map((el) => el.trim());

        // Check for correct ingredient format
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format ⛔');

        const [rawQuantity, unit, description] = ingArr;

        // quantity should be null if it is ''
        const quantity = rawQuantity ? Number(rawQuantity) : null;

        return { quantity, unit, description };
      });

    // Create recipe object in the format of Forkify API to be uploaded
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceURL,
      image_url: newRecipe.imageURL,
      servings: newRecipe.servings,
      cooking_time: newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // create recipe obj and add conditionally key property to it.
    state.recipe = createRecipeObject(data);

    // add to bookmarks array and store it in localStorage
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

////////////////////////////////////////
// Initialization

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (!storage) return;

  state.bookmarks = JSON.parse(storage);
};
init();

////////////////////////////////////////
// For Testing

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
