import axios from 'axios';

import {key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async  getResults() {
      //  const key = `f9e2a5e0d4c01b49146ac5f9c51058d9`;
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = res.data.recipes;

        } catch (error) {
            alert(error);
        }
    }


}