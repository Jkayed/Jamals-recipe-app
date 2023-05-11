const deleteUser = document.querySelector('.trash')
const _User = document.querySelector('.trash')

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  
};


// deleteUser.addEventListener('click', function(id) {
// id = state.recipe.id.startsWith('6')
//    const index2 = state.search.results.findIndex(el => el.id === id)
//    console.log(index2);
//    })



// if(res.status = 'success') {
//   _toggle.classList.toggle('hidden')
// }
// const deleteRecipeOject = function (data) {
//   const { recipe } = data.data;
//   return {

//     id: recipe.id,
//     title: recipe.title,
//     publisher: recipe.publisher,
//     sourceUrl: recipe.source_url,
//     image: recipe.image_url,
//     servings: recipe.servings,
//     cookingTime: recipe.cooking_time,
//     ingredients: recipe.ingredients,
//     ...(recipe.key && { key: recipe.key }),
   
//   };

// };
 console.log(state);
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };

};




export const loadRecipe = async function (id) {
  

  try {
 
  const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
      
  
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
    // document.querySelector('.trash').addEventListener('click', function() {
      // this._deleteUserRecipe.addEventListener(click,function() {
      if(state.recipe.id.startsWith('6')) {
        console.log('yo');
        const index = state.search.results.findIndex(el => el.id === id);
    state.search.results.splice(index, 1);
        // state.recipe.findIndex('repcipe')
          // const remRecipes = data.recipes
          // console.log(remRecipes);
        const del = delete state.recipe.result
        delete state.recipe
       
        // resultsView.update(state.search.results)
        console.log(state.search.results)
       delRecipes()


        // recipeView.update(state.search.results)
      
      
  
        // document.querySelector('.preview').textContent = ''
        // resultsView.update(getSearchResultsPage());
      }
     
    // })
    // })
    }
   catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
  
};

// export const DeleteRecipe = function(id) {
//   try {
//     const data = Del(`${DEL_URL}${id}?key=${KEY}`)
//     state.recipe = deleteRecipeOject(data);
//   } catch(err) {
//     console.log(`${err} 💥💥💥💥 `);
//     throw err;
//   }
// }



export const loadSearchResults = async function (query) {
 
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    if (data.results > '0') {
     document.querySelector('.bookmarked-recipes').classList.add('hidden')
    }
    // deleteUserRecipe = function (id) {
     
    //   // if (id === state.recipe.id) state.recipe = false;
      
    // }
   

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
  
    });
    console.log(data.data.recipes);
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
//   if(state.recipe.key) {
//     console.log('yo');
//     delete state.recipe
//     const findIndexArr = state.search.results.findIndex('Pizza')
// console.log(findIndexArr);  
// }
};



export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const delRecipes = function() {
  localStorage.setItem('recipes', JSON.stringify(state.search.results))
  // localStorage.setItem('recipes', JSON.stringify(state.recipe))

}
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

if(state.bookmarks.length == '0') {

}
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};
////////// cant use .findIndex, we need to find index and copy "Delete Bookmark"


const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);

  const recipeStorage = localStorage.getItem('recipe');
    state.search.results = JSON.parse(recipeStorage)
  
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3){
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
        
          );
        
        }
// console.log(uploadRecipe());
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    
 
  } catch (err) {
    throw err;
  }

};
