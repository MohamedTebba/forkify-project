import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { elements.searchInput.value = ''; };

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
   
};

export const highLightSelected = id =>{
    //console.log(id);
    if(document.querySelector(`a[href="#${id}"]`)){
        Array.from(document.querySelectorAll(`a`)).forEach(el=>el.classList.remove('results__link--active'));
        document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
    }
    
};

const limitRecipeTitle = (title, limit = 17) => {
    const reducedTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                reducedTitle.push(cur);
            }

            return acc + cur.length;
        }, 0);

        return `${reducedTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
</svg>
</button>
` ;

const renderButtons = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //for only the next button
        button = createButton(page, 'next');

    } else if (page < pages) {
        //for both buttons 
        button = `${createButton(page, 'next')}
                  ${createButton(page, 'prev')}`;
    } else if (page === pages && pages > 1) {
        // for only the previous button
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of curr page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

