import React, { useEffect } from "react";
import { LoginBg } from "../assets/video";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {app} from "../config/firebase.config";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {useStateValue} from "../context/StateProvider";
import {validateUser} from "../api";
import {actionType} from "../context/reducer";
const Login = ({ setAuth, auth }) => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();


  useEffect(() => {
    if (window.localStorage.getItem("auth") === "true")
      navigate("/", { replace: true });
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth,provider).then(
      (userCred) =>{

        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              validateUser(token).then((data) =>  {
                setAuth(true)
                window.localStorage.setItem("auth", "true");
                dispatch({
                  type:actionType.SET_USER,
                  user:data
                })
              })
            });
          }
          else{
            setAuth(false);
            dispatch({
              type:actionType.SET_USER,
              user:null
            })
            navigate('/login')
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  };
  useEffect(() => {
    if(window.localStorage.getItem("auth")==="true"){
      navigate("/",{replace:true})
    }
  }, [auth]);

  return (
      <div className="relative w-screen h-screen bg-green-500">
        {/*<video src={LoginBg} type="video/mp4" autoPlay muted loop className="w-full h-full object-cover" ></video>*/}
        <div className="absolute inset-0 bg-darkOverlay flex items-center justify-center p-4">
          <div className="w-full md:w-375 p-4 bg-lightOverlay shadow-2xl rounded-md backdrop-blur-md flex flex-col items-center justify-center">
            <div
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-400 cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
            >
              <FcGoogle className="text-xl" />
              <p>Sign In with Google</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;