import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error){
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime(){
        //Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }
    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            
            // 1. Uniform units
            let ingredient = el.toLowerCase(); //let because of mutability
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); //menjanja jednog array-a sa parnjakom iz drugog
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // this is a regular expression

            // 3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2)); //find the position of the unit
            
            let objIng;

            if (unitIndex > -1){ //-1 means the element couldn't be found
                //There is a unit
                //Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                //Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); 
                
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }
                else{
                    count  = eval(arrIng.slice(0, unitIndex).join('+')); //counts the numbers as strings
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };
            }
            else if (parseInt(arrIng[0]), 10){
                //There is NO unit, but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1){
                //There is NO unit and NO number in the 1st positions
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient //like ingredient:ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
}