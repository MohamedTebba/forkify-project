export default class Likes {
    
    constructor(){
        this.likes = [];
    }

    addLike(id,title,author,img){
        const like = {
            id,
            title,
            author,
            img
            };
        this.likes.push(like);
        this.saveData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(like => like.id === id );
        this.likes.splice(index,1);
        this.saveData();
    }

    isLiked(id){
        
        return this.likes.findIndex(like => like.id === id) !== -1;

    }

    getNumLikes(){
        return this.likes.length;
    }

    saveData(){
         localStorage.setItem('storedLikes',JSON.stringify(this.likes));
    }

    loadData(){
         const loadedData = JSON.parse(localStorage.getItem('storedLikes'));
         if(loadedData){
             this.likes = loadedData;
         }
    }

}