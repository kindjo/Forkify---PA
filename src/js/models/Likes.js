export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        return like;
    }

    deleteLike(id){
        console.log(this.likes);
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        console.log(index);
        console.log(this.likes);
    }

    isLiked(id){
        console.log(id);
        console.log(this.likes.findIndex(el => el.id === id) !== -1);
        return this.likes.findIndex(el => el.id === id) !== -1;
        
    }

    getNumLikes(){
        return this.likes.length;
    }
}