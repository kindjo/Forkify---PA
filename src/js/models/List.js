import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        //pass in a start index and how many we need, and then it deletes them from the array (mutates)
        //[2,4,8] splice (1, 2) -> returns [4, 8], original array is [2]
        //[2,4,8] splice (1, 1) -> returns 4, original array is [2, 4, 8]
        this.items.splice(index, 1);     
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;   //loop through all the elements in an item and select the IDs that are equal to those we passed into the function
    }
}