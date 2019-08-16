import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';




//---------------------- Global state of the app ----------------------//
//---------------------- SEARCH OBJECT ----------------------//
//---------------------- CURRENT RECIPE OBJECT ----------------------//
//---------------------- SHOPPING LIST OBJECT ----------------------//
//---------------------- LIKED RECIPES ----------------------//

const state = {}; //sve sto se u tom trenutku desava na UI - kako bi imao trenutno stanje svega
window.state = state;

// -------------------------- SEARCH CONTROLLER -------------------------- //

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(err){
            alert('Something went wrong with the search!');
            clearLoader();
            console.log(err);

        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //so the page doesn't refresh
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //takes everything contained in the <button> and uses it like one object
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// -------------------------- RECIPE CONTROLLER -------------------------- //

const controlRecipe = async () => {
    //Get the ID from the URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id){
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);
        
        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
                    
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }
        catch(error) {
            console.log(error);
            alert('Error processing recipe!');
        } 
    }
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);      // this becomes that


// -------------------------- LIST CONTROLLER -------------------------- //


const controlList = () => {
    //Create a new list IF there is none yet
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);  //adds onto the UI
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }
    //Handle the count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){        //* means any child
        // Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } 
    else if (e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
});

window.l = new List();