import axios from 'axios';
import {key} from '../config';

function myGoodEval(obj){
    return Function('"use strict";return (' + obj + ')')();
}

export default class Recipe{
    
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    calcTime(){
        /**Assuming that we need 15min for each 3 ingredients */
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
       this.servings = 4;
    }

    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitShort,'g','kg'];

        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit, units[i]);  
            });

            // remove parentheses
             ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(u => units.includes(u));
            
            let objIng;
            if(unitIndex > -1){
                /**there is a unit */
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1){
                    /** case of number before the unit :EX 4 cups */
                    count = myGoodEval(arrIng[0].replace('-','+'));
                }else{
                    //instead of eval i'm using a created function
                    count = myGoodEval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0], 10)){ // ParseInt with base 10
                /**there is no unit but the 1st el is a number*/
                objIng = {
                    count:parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient:arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1){
                /** no unit no number in 1st position */
                objIng = {
                    count :1,
                    unit :'',
                    ingredient
                };

            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServingsIngredients(type){ 
        const newServings = type === 'inc' ? this.servings+1 : this.servings-1;
        this.ingredients.forEach(ing => ing.count=ing.count*newServings/this.servings);
        this.servings = newServings;
    }

}
