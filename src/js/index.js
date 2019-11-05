import Search from './models/Search';
import * as searchView from './views/searchView';
import * as likesView from './views/likesView';
import * as recipeView from './views/recipeView';
import { elements,renderLoader,clearLoader } from './views/base';
import Recipe from './models/Recipe';
import * as listView from'./views/listView';
import List from'./models/List';
import Like from'./models/Likes';
/**for the app state we  use redex but for its sipmlicity im creating just a variable */

/**golobal state
 * --saerech object
 * -- current recipe object
 * --shoping list object
 * --liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controllerSearch = async () => {
    /**get query from view */
    const query = searchView.getInput();

    if (query) {
        /**new search object + add it to state */
        state.search = new Search(query);
        /**prepare UI for results */
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultList.parentNode);
        try {
            /**search for recipes */
            await state.search.getResults();
            //console.log('the problem');
            //console.log(state.search);
            /**render results on UI */
            clearLoader();
            
            searchView.renderResults(state.search.recipes);
            
            
            
        } catch (error) {
            console.log(error);
        }
    }

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllerSearch();
});

elements.searchResPages.addEventListener('click',e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes,goToPage);
        

    }
});

/**
 * RECIPE CONTROLLER
 */

 const controllerRecipe = async () =>{
     const id =parseInt(window.location.hash.split('#')[1]);
     if(id){
         /**prepare ui for changes */
         recipeView.clearRecipe();
         renderLoader(elements.recipeClass);
         /** Create new recipe object*/
         state.recipe = new Recipe(id);
         
         try {
             /**get recipe data and parse ingredients */
             await state.recipe.getRecipe();
             state.recipe.parseIngredients();

             /**calc servings and time */
    
             state.recipe.calcTime();
             state.recipe.calcServings();
    
             /**render recipe */
             clearLoader();
             searchView.highLightSelected(id);
             recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
             
         } catch (error) {
             alert(error); 
         }
     }
 };
['hashchange','load'].forEach(event => window.addEventListener(event, controllerRecipe));
/**
 * LIST CONTROLLER
 */
const listController =() =>{
if(!state.list) state.list = new List();
state.recipe.ingredients.forEach(el => {
    const listItem = state.list.addItem(el.count,el.unit,el.ingredient);
    listView.renderItem(listItem);
});


};

/**
 * LIKES CONTROLLER
 */
//likesView.toggleLikeMenu(0);
//likesView.toggleLikeMenu(0);
 const likesController = () =>{

    if(!state.likes) state.likes = new Like();
    const id = state.recipe.id;

    if(!state.likes.isLiked(id)){
        //add like to the likes array
        const like = state.likes.addLike(id,state.recipe.title,state.recipe.author,state.recipe.img);
        //toggle btn
        likesView.toggleLikeBtn(true);
        
        //add like to UI
        likesView.renderLikes(like);
        console.log(state.likes);
        
    }else{
        //delete like from the likes array
        state.likes.deleteLike(id);
        //toggle btn
        likesView.toggleLikeBtn(false);
        
        //remove like from UI
        likesView.removeLike(id);
        console.log(state.likes);
    }
    //console.log(state.likes.getNumLikes());
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    

 };

 window.addEventListener('load',()=>{
    
     state.likes = new Like();
     state.likes.loadData();
     state.likes.likes.forEach(like => {
         likesView.renderLikes(like);
     });
     likesView.toggleLikeMenu(state.likes.getNumLikes());

 });

elements.shoppingList.addEventListener('click',e => {
    
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        const id = e.target.closest('.shopping__item').dataset.itemid;
        listView.deleteItem(id);
        state.List.deleteItem(id);
       // console.log(e.target.closest('.shopping__item').dataset.itemid);
    }else if(e.target.matches('.shopping__count')){
        const val =parseFloat( e.target.value);
        state.list.updateCount(id,val);
    }

});

elements.recipeClass.addEventListener('click',e => {
    if(e.target.matches('.btn-inc, .btn-inc *')){
        state.recipe.updateServingsIngredients('inc');
        recipeView.updateUIDecInc(state.recipe);
    }else if(e.target.matches('.btn-dec, .btn-dec *')){
        if(state.recipe.servings>1){
            state.recipe.updateServingsIngredients('dec');
            recipeView.updateUIDecInc(state.recipe);
        }
    }else if(e.target.matches('.shopping__add, .shopping__add *')){
        console.log('hhhhhh');
        listController();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){

        likesController();

    }
    
});




