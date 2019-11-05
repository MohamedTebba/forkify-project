export const elements = {

    searchForm:document.querySelector('.search'),
    searchInput:document.querySelector('.search__field'),
    searchResultList:document.querySelector('.results__list'),
    searchResPages:document.querySelector('.results__pages'),
    recipeIngredients:document.querySelector('.recipe__ingredient-list'),
    recipeClass:document.querySelector('.recipe'),
    shoppingList:document.querySelector('.shopping__list'),
    likesList :document.querySelector('.likes__panel')
}; 

const elementString = {
    loader:'loader'
};

 export const renderLoader = parent => {
     const loader = `
     <div class='${elementString.loader}'>
      <svg>
        <use href='img/icons.svg#icon-cw'></use>
      </svg>
     </div>
     `;
     parent.insertAdjacentHTML('afterbegin',loader);
 };

 export const clearLoader = () => {
     const loader = document.querySelector(`.${elementString.loader}`);
     if(loader) loader.parentElement.removeChild(loader);
 };