import React from 'react';
import Header from "./Header";
import {NavLink, Route, Routes} from "react-router-dom";
import {IoHome} from "react-icons/io5";
import {isActiveStyles, isNotActiveStyles} from "../utils/styles";
import DashboardHome from "./DashboardHome";
import DashboardUsers from "./DashboardUsers";
import DashboardArtists from "./DashboardArtists";
import DashboardSongs from "./DashboardSongs";
import AddNewSong from "./AddNewSong";
import {AddNewArtist} from "./AddNewArtist";

const Dashboard = () => {
  return (
      <div className='w-full h-auto flex flex-col items-center justify-center bg-zinc-950'>
        <Header />

        <div className="w-full p-4 flex items-center justify-evenly bg-zinc-900">
          {/* prettier-ignore */}
          <NavLink to={"/dashboard/home"}><IoHome className="text-2xl text-white" /></NavLink>
          {/* prettier-ignore */}
          <NavLink to={"/dashboard/user"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Users </NavLink>

          {/* prettier-ignore */}
          <NavLink to={"/dashboard/songs"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Songs </NavLink>

          {/* prettier-ignore */}
          <NavLink to={"/dashboard/artist"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Artist </NavLink>
        </div>
        <div className=" w-full h-screen p-4 bg-zinc-900">
          <Routes>
            <Route path="/home" element={<DashboardHome />} />
            <Route path="/user" element={<DashboardUsers />} />
            <Route path="/songs" element={<DashboardSongs />} />
            <Route path="/artist" element={<DashboardArtists />} />
            <Route path="/newSong" element={<AddNewSong />} />
            <Route path="/newArtist" element={<AddNewArtist/>}/>
          </Routes>
        </div>
      </div>
  );
};

export default Dashboard;
