import {useState} from "react";
import {useStateValue} from "../context/StateProvider";
import {deleteObject, ref} from "firebase/storage";
import {storage} from "../config/firebase.config";
import {getAllArtist, saveNewArtist} from "../api";
import {actionType} from "../context/reducer";
import {ImageLoader} from "./util/ImageLoader";
import {ImageUploader} from "./util/ImageUploader";
import {MdDelete} from "react-icons/md";
import {DisabledButton} from "./AddNewSong";
import AlertSuccess from "./util/AlertSuccess";
import AlertError from "./util/AlertError";
import { motion } from "framer-motion";

export const AddNewArtist = () =>   {
  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);

  const [alert, setAlert] = useState("false");
  const [alertMsg, setAlertMsg] = useState(null);
  const [artistCoverImage, setArtistCoverImage] = useState(null);

  const [artistName, setArtistName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [{ artists }, dispatch] = useStateValue();

  const deleteImageObject = (songUrl) => {
    setIsArtist(true);
    setArtistCoverImage(null);
    const deleteRef = ref(storage, songUrl);
    deleteObject(deleteRef).then(() => {
      setAlert('Success');
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert("false");
      }, 4000);
      setIsArtist(false);
    });
  };

  const saveArtist = () => {
    if (!artistCoverImage || !artistName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert("false");
      }, 4000);
    } else {
      setIsArtist(true);
      const data = {
        name: artistName,
        imageUrl: artistCoverImage,
        instagram: instagram,
      };
      saveNewArtist(data).then((res) => {
        setAlert("success");
        setAlertMsg("Artist Saved Successfully");
        setTimeout(() => {
          setAlert("false");
        }, 4000);
        getAllArtist().then((artistData) => {
          dispatch({ type: actionType.SET_ARTISTS, artists: artistData.data });
        });
      });
      setIsArtist(false);
      setArtistCoverImage(null);
      setArtistName("");
      setInstagram("");
    }
  };

  return (
      <div className="flex items-center justify-evenly w-full flex-wrap">
        <div className="bg-zinc-900  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-zinc-950 cursor-pointer">
          {isArtist && <ImageLoader progress={artistProgress} />}
          {!isArtist && (
              <>
                {!artistCoverImage ? (
                    <ImageUploader
                        setImageUrl={setArtistCoverImage}
                        setAlert={setAlert}
                        alertMsg={setAlertMsg}
                        isLoading={setIsArtist}
                        setProgress={setArtistProgress}
                        isImage={true}
                    />
                ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <img
                          src={artistCoverImage}
                          alt="uploaded image"
                          className="w-full h-full object-cover"
                      />
                      <button
                          type="button"
                          className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                          onClick={() => {
                            deleteImageObject(artistCoverImage);
                          }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                )}
              </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 ">
          <input
              type="text"
              placeholder="Artist Name"
              className="w-full lg:w-300 p-3 rounded-md text-base text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
          />

          <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
            <p className="text-base font-semibold text-gray-400">
              www.instagram.com/
            </p>
            <input
                type="text"
                placeholder="your id"
                className="w-full text-base text-textColor outline-none bg-transparent"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
            {isArtist ? (
                <DisabledButton />
            ) : (
                <motion.button
                    whileTap={{ scale: 0.75 }}
                    className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                    onClick={saveArtist}
                >
                  Save Artist
                </motion.button>
            )}
          </div>
        </div>

        {alert!=="false" && (
            <>
              {alert === "success" ? (
                  <AlertSuccess msg={alertMsg} />
              ) : (
                  <AlertError msg={alertMsg} />
              )}
            </>
        )}
      </div>
  );
};
