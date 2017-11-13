import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-65932.firebaseio.com/'
});

export default instance;