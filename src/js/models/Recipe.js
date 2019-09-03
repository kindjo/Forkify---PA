import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            //This navigates inside the API and gathers information in order to display it on the UI
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        // Assuming that we need 15min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];           //Unit destructuring

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase(); //let because of mutability

            // 1. Uniform units
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');  // this is called a regular expression

// ---------------------------------- DODATNO OBJASNJENJE ----------------------------------- //

            // 3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' '); //split on the empty spaces and add to an array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); //find the position of the unit

            let objIng;
            if (unitIndex > -1) { //-1 means the element couldn't be found
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval(4+1/2) ---> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                //console.log(arrCount);
                //console.log(arrIng);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')) ;
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));  //eval counts the strings as numbers
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') 
                };
            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // slice everything except the 1st arr element
                };
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient //like typing ingredient:ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}





/*
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
            let ingredient = el.toLowerCase(); //let because of mutability

            // 1. Uniform units
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); //swapping one array item for his equal in the other
            });

            // 2. Remove parentheses                                
            ingredient = ingredient.replace(/ *\([^)]*\) */
            /*
            g, ' '); // this is a regular expression

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
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            }
            else if (parseInt(arrIng[0]), 10){
                //There is NO unit, but the 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
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
*/

