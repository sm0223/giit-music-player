import axios from 'axios';

const api = axios.create(
    {
        baseURL : 'http://localhost:9192/api/'
    }
);
export const validateUser = async(token) => {
     try {
        const res = await api.post('users/login', null,{
            headers:{
                Authorization: "Bearer " + token
            }
        })
        return res.data;
     } catch(err) {
        console.log("err " , err)
     }
}