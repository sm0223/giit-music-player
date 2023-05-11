import React, {useState} from 'react';
import LOGO from '../assets/giit-samarkan.png'
import {NavLink, useNavigate} from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import { FaCrown} from 'react-icons/fa'
import {useStateValue} from "../context/StateProvider";
import {motion} from "framer-motion";
import {getAuth} from "firebase/auth";
import {app} from "../config/firebase.config";
const Header = () => {
  const [{user}, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState(false);
  const logout = () => {
    const firebaseAuth = getAuth(app);
     firebaseAuth.signOut().then(()=>{
       window.localStorage.setItem("auth","false");
     }).catch((error)=>console.log("SIGNOUT ERROR",error))
    navigate('/login', {replace:true})
  };
  return (
      <header className='flex items-center w-full p-4 md:py-2 md:px-6 bg-zinc-950'>
        <NavLink to={"/"}>
          <img src ={LOGO} className="w-16"/>
        </NavLink>
        <ul className='flex items-center justify-center ml-7'>
          <li className='mx-5 text-lg text-white '><NavLink to={'/home'} className = {({isActive})=>isActive?isActiveStyles:isNotActiveStyles}>Home</NavLink></li>
          <li className='mx-5 text-lg text-white'><NavLink to={'/music'} className = {({isActive})=>isActive?isActiveStyles:isNotActiveStyles}>Music</NavLink></li>
          <li className='mx-5 text-lg text-white'><NavLink to={'/premium'} className = {({isActive})=>isActive?isActiveStyles:isNotActiveStyles}>Premium</NavLink></li>
          <li className='mx-5 text-lg text-white'><NavLink to={'/contact'} className = {({isActive})=>isActive?isActiveStyles:isNotActiveStyles}>Contact</NavLink></li>
        </ul>
        <div
            onMouseEnter={()=>setIsMenu(true)}
            onMouseLeave={()=>setIsMenu(false)}
            className='flex items-center ml-auto cursor-pointer gap-2 relative'>
          <img className='w-12 h-12 min-w-[44px] object-cover rounded-full shadow-lg'
               src = {user?.user?.imageUrl}
               alt='' referrerPolicy='no-referrer'/>
          <div className='flex flex-col text-white'>
            <p className='font-semibold'> {user?.user?.name} </p>
            <p className='flex items-center gap-2'> {user?.user?.role} {user?.user?.role === "PREMIUM MEMBER" && <FaCrown className='text-yellow-500'/>} </p>
          </div>

          {isMenu && <motion.div
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 50}}

              className="absolute z-10 top-12 right-0 w-190 p-4 gap-4 bg-zinc-800 shadow-md rounded-sm  flex flex-col"
          >
            <NavLink to={"/userProfile"}>
              <p className="text-base text-white hover:font-semibold duration-150 transition-all ease-in-out">
                Profile
              </p>
            </NavLink>
            <p className="text-base text-white hover:font-semibold duration-150 transition-all ease-in-out">
              My Favourites
            </p>
            {user?.user?.role === "ADMIN" && (
                <>
                  <NavLink to={"/dashboard/home"}>
                    <p className="text-base text-white hover:font-semibold duration-150 transition-all ease-in-out">
                      Dashboard
                    </p>
                  </NavLink>
                </>
            )}
            <p className="text-base text-white hover:font-semibold duration-150 transition-all ease-in-out"
               onClick={logout}>
              Sign out
            </p>
          </motion.div>}
        </div>
      </header>
  );
};

export default Header;
