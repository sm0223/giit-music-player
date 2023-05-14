import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useStateValue } from "../context/StateProvider";
import { Link } from "react-router-dom";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllArtist } from "../api";
import { actionType } from "../context/reducer";

const DashboardArtist = () => {
  const [{ artists }, dispatch] = useStateValue();

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      });
    }
  }, []);

  return (
      <div className="w-full p-4 flex items-center justify-center flex-col">
        <div className="relative w-full gap-3 my-4 p-4 py-12 bg-zinc-800 rounded-md flex flex-wrap justify-evenly">
          {artists &&
              artists.map((data, index) => (
                  <>
                    <ArtistCard key={data._id} data={data} index={index} />
                  </>
              ))}
        </div>
      </div>
  );
};

export const ArtistCard = ({ data, index }) => {
  const [isDelete, setIsDelete] = useState(false);
  return (
      <motion.div
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-44 min-w-180 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-gray-200 bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
      >
        <img src={data?.imageUrl} className="w-full h-40 object-cover rounded-md"  alt="" />

        <p className="text-base text-headingColor font-semibold">{data.name}</p>
        <div className="flex items-center gap-4">
          <a href={'https://instagram.com/'+data.instagram} target="_blank">
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoInstagram className="text-gray-500 hover:text-rose-500 text-xl" />
            </motion.i>
          </a>
        </div>
        <motion.i
            className="absolute bottom-2 right-2"
            whileTap={{ scale: 0.75 }}
            onClick={() => setIsDelete(true)}
        >
        </motion.i>
      </motion.div>
  );
};

export default DashboardArtist;
