import React, { useEffect, useRef, useState } from "react";
import {
  ref,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../config/firebase.config";
import { useStateValue } from "../context/StateProvider";
import FilterButtons from "./util/FilterButtons";
import {
  getAllArtist,
  getAllSongs,
  saveNewArtist,
  saveNewSong,
} from "../api";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import { IoMusicalNote } from "react-icons/io5";
import AlertSuccess from "./util/AlertSuccess";
import AlertError from "./util/AlertError";
import {ImageUploader} from "./util/ImageUploader";
import {ImageLoader} from "./util/ImageLoader";
import {AddNewArtist} from "./AddNewArtist";

export const DisabledButton = () => {
  return (
      <button
          disabled
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        <svg
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
          />
          <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
          />
        </svg>
        Loading...
      </button>
  );
};

const AddNewSong = () => {
  console.log("DBOARD")
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageUrl, setSongImageUrl] = useState(null);
  const [setAlert, setSetAlert] = useState("false");
  const [alertMsg, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [songName, setSongName] = useState("");
  const [audioAsset, setAudioAsset] = useState(null);
  const [duration, setDuration] = useState(null);
  const audioRef = useRef();

  const [
    {
      artists,
      artistFilter,
      filterTerm,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }
  }, []);

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin} : ${returnSec}`;
  };

  const deleteImageObject = (songUrl, action) => {
    if (action === "image") {
      setIsImageLoading(true);
      setSongImageUrl(null);
    } else {
      setIsAudioLoading(true);
      setAudioAsset(null);
    }
    const deleteRef = ref(storage, songUrl);
    deleteObject(deleteRef).then(() => {
      setSetAlert("Success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setSetAlert("false");
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
    });
  };

  const saveSong = () => {
    if (!songImageUrl || !audioAsset || !songName) {
      setSetAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setSetAlert("false");
      }, 4000);
    } else {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      const data = {
        name: songName,
        imageUrl: songImageUrl,
        songUrl: audioAsset,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
      };

      saveNewSong(data).then((res) => {
        getAllSongs().then((songs) => {
          dispatch({ type: actionType.SET_ALL_SONGS, allSongs: songs.data });
        });
      });
      setSetAlert("success");
      setAlertMsg("Data saved successfully");
      setTimeout(() => {
        setSetAlert("false");
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
      setSongName("");
      setSongImageUrl(null);
      setAudioAsset(null);
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
      setDuration(null);
    }
  };

  return (
      <div className="flex items-center justify-center p-4 bg-zinc-800 rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col items-center justify-center gap-4">
            <input
                type="text"
                placeholder="Type your song name"
                className="w-full p-3 rounded-md text-base text-textColor outline-none shadow-sm bg-zinc-900"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
            />

            <div className="flex w-full justify-between flex-wrap items-center gap-4">
              <FilterButtons filterData={artists} flag={"Artist"} />
              <FilterButtons filterData={filterByLanguage} flag={"Language"} />
              <FilterButtons filterData={filters} flag={"Category"} />
            </div>

            <div className="flex items-center justify-between gap-2 w-full flex-wrap">
              {/*Uploading song Image*/}
              <div className="bg-zinc-900 backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-zinc-950 cursor-pointer">
                {isImageLoading && <ImageLoader progress={uploadProgress} />}
                {!isImageLoading && (
                    <>
                      {!songImageUrl ? (
                          <ImageUploader
                              setImageUrl={setSongImageUrl}
                              setAlert={setSetAlert}
                              alertMsg={setAlertMsg}
                              isLoading={setIsImageLoading}
                              setProgress={setUploadProgress}
                              isImage={true}
                          />
                      ) : (
                          <div className="relative w-full h-full overflow-hidden rounded-md">
                            <img
                                src={songImageUrl}
                                alt="uploaded image"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                                onClick={() => {
                                  deleteImageObject(songImageUrl, "image");
                                }}
                            >
                              <MdDelete className="text-white" />
                            </button>
                          </div>
                      )}
                    </>
                )}
              </div>
              {/*Uploading Song */}
              <div className="bg-zinc-900 backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-zinc-950 cursor-pointer">
                {isAudioLoading && <ImageLoader progress={uploadProgress} />}
                {!isAudioLoading && (
                    <>
                      {!audioAsset ? (
                          <ImageUploader
                              setImageUrl={setAudioAsset}
                              setAlert={setSetAlert}
                              alertMsg={setAlertMsg}
                              isLoading={setIsAudioLoading}
                              setProgress={setUploadProgress}
                              isImage={false}
                          />
                      ) : (
                          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                            <audio ref={audioRef} src={audioAsset} controls />
                            <button
                                type="button"
                                className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                                onClick={() => {
                                  deleteImageObject(audioAsset, "audio");
                                }}
                            >
                              <MdDelete className="text-white" />
                            </button>
                          </div>
                      )}
                    </>
                )}
              </div>

              <div className="flex items-center justify-end w-full p-4">
                {isImageLoading || isAudioLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                        onClick={saveSong}
                    >
                      Save Song
                    </motion.button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full p-4">
            <AddNewArtist />
          </div>
        </div>
        {setAlert!=="false" && (
            <>
              {setAlert === "success" ? (
                  <AlertSuccess msg={alertMsg} />
              ) : (
                  <AlertError msg={alertMsg} />
              )}
            </>
        )}
      </div>
  );
};


export default AddNewSong;
