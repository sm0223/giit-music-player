import {Route, Routes, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {app} from "./config/firebase.config";
import {AnimatePresence} from "framer-motion";
import {getAllSongs, validateUser} from "./api";
import {useStateValue} from "./context/StateProvider";
import {actionType} from "./context/reducer";
import {Dashboard, Login, Home} from "./components";
import './App.css'
import MusicPlayer from "./components/MusicPlayer";
import {motion} from 'framer-motion'
function App() {
  const [auth, setAuth] = useState(window.localStorage.getItem("auth")==="true");
  const [{ user, allSongs, song, isSongPlaying, miniPlayer }, dispatch] =
      useStateValue();
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if(userCred) {
        userCred.getIdToken().then((token)=>{
          validateUser(token).then((data)=>{
            dispatch({
              type:actionType.SET_USER,
              user:data
            })
          })
        })
      }
      else{
        setAuth(false)
        window.localStorage.setItem("auth", "false")
        dispatch({
          type:actionType.SET_USER,
          user:null
        })
        navigate('/login')
      }
    })
  }, []);

  useEffect(() => {
    console.log("DISPATCHINGdf")
    if (!allSongs && user) {
      console.log("DISPATCHINGdf")
      getAllSongs().then((data) => {
        console.log("DISPATCHING")
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      }, (err)=>{
        console.log("FAILURE IN DISPACTH")
      });
    }
  }, []);


  return (
    <AnimatePresence mode="wait">
      <div className="h-auto flex items-center justify-center min-w-[680px]">
        <Routes>
          <Route path = '/login' element = {<Login setAuth={setAuth} auth = {auth}/>}/>
          <Route path = '/*' element = {<Home />}/>
          <Route path = '/Dashboard/*' element={<Dashboard/>}/>
        </Routes>
        {isSongPlaying && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
            >
              <MusicPlayer />
            </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
export default App;
