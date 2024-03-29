import uniqid from'uniqid';

export default class List {
    constructor(){
        this.items=[];
    }

    addItem(count,unit,content){
        const item={
            count,
            unit,
            content,
            id:new uniqid()
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(item => item.id === id );
        this.items.splice(index,1);
    }

    updateCount(id,newCount){
        this.items.find(item => item.id === id).count = newCount;
    }




}