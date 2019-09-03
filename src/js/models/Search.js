import axios from 'axios';                  //axios is a better fetch because fetch can't be used on older browsers
import { key, proxy } from '../config';

export default class Search{
    constructor(query){
        this.query = query;
    }

     async getResults(){
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
            //console.log(this.getResults());
        }
        catch (error){
            alert(error);
        }  
    }
}

