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

export const getAllArtist = async () => {
  try {
    const res = await api.get(`artists/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await api.get(`users/getall`);
    console.log("getAllUsers",res)
    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeUser = async (userId) => {
  try {
    const res = api.delete(`users/delete/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const getAllSongs = async () => {
  try {
    const res = await api.get(`songs/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllAlbums = async () => {
  try {
    const res = await api.get(`albums/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};
export const changingUserRole = async (userId, role) => {
  try {
    const res = api.put(`users/updateRole/${userId}`, {
      data: { role: role },
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const deleteSongById = async (id) => {
  try {
    console.log('REQUEST DELETE '+id)
    const res = api.delete(`songs/delete/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};
export const saveNewSong = async (data) => {
  try {
    const res = api.post(`/songs/save`, { ...data });
    return (await res).data.song;
  } catch (error) {
    return null;
  }
};

export const saveNewArtist = async (data) => {
  try {
    const res = api.post(`artists/save`, { ...data });
    return (await res).data.artist;
  } catch (error) {
    return null;
  }
};