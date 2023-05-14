import React, { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

import { motion } from "framer-motion";
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

const FilterButtons = ({ filterData, flag }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);

  const [{ artistFilter, albumFilter, filterTerm }, dispatch] = useStateValue();

  const updateFilterButton = (name) => {
    setFilterName(name);
    setFilterMenu(false);

    if (flag === "Artist") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    }
    if (flag === "Language") {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: name });
    }

    if (flag === "Albums") {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: name });
    }

    if (flag === "Category") {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: name });
    }
  };

  return (
    <div className="bg-zinc-800 rounded-md px-4 py-1 relative cursor-pointer hover:bg-zinc-950">
      <p
        className="text-base tracking-wide text-textColor flex items-center gap-2 "
        onClick={() => setFilterMenu(!filterMenu)}
      >
        {!filterName && flag}
        {filterName && (
          <>
            {filterName.length > 15
              ? `${filterName.slice(0, 14)}...`
              : filterName}
          </>
        )}
        <IoChevronDown
          className={`text-base text-textColor duration-150 transition-all ease-in-out ${
            filterMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>
      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-48 z-50 backdrop-blur-sm bg-zinc-900 max-h-44 overflow-y-scroll no-scrollbar py-2 flex flex-col rounded-md shadow-md absolute top-8 left-0"

        >
          {filterData?.map((data) => (
            <div
              key={data.name}
              className="flex items-center text-textColor gap-2 px-4 py-1 hover:bg-zinc-950"
              onClick={() => updateFilterButton(data.name)}
            >
              {(flag === "Artist" || flag === "Albums") && (
                <img
                  src={data.imageUrl}
                  className="w-8 min-w-[32px] h-8 rounded-full object-cover"
                  alt=""
                  referrerPolicy='no-referrer'
                />
              )}
              <p className="w-full">
                {data.name.length > 15
                  ? `${data.name.slice(0, 14)}...`
                  : data.name}
              </p>
            </div>
          ))}
          {
            filterData.length==0 && <div className="flex items-center text-textColor gap-2 px-4 py-1 hover:bg-zinc-950">
                <p className="w-full">
                  Nothing to Show
                </p>
              </div>
          }
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtons;
