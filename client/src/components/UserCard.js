import React, { useState } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import {changingUserRole, getAllUsers, removeUser} from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { MdDelete } from "react-icons/md";

const UserCard = ({ data, index }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [{ allUsers, user }, dispatch] = useStateValue();
  const createdAt = moment(new Date(data.createdAt)).format("MMMM Do YYYY");

  const UpdateUserRole = (userId, role) => {
    setIsLoading(true);
    changingUserRole(userId, role).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    });
  };

  const deleteUser = (userId) => {
    setIsLoading(true);
    removeUser(userId).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    });
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-full rounded-sm flex items-center justify-between py-4 bg-zinc-900 cursor-pointer hover:bg-zinc-950 hover:shadow-lg"
      >
        {data._id !== user?.user._id && (
            <motion.div
                whileTap={{ scale: 0.75 }}
                className="absolute left-4 w-8 h-8 rounded-md flex items-center justify-center"
                onClick={() => deleteUser(data._id)}
            >
              <MdDelete className="text-xl text-red-400 hover:text-red-500" />
            </motion.div>
        )}
        <div className="w-275 min-w-[160px] flex items-center justify-center">
          <img src={data.imageUrl} alt="" className="w-10 h-10 object-cover rounded-md min-w-[40px] shadow-md" referrerPolicy="no-referrer"
          />
        </div>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.name}</p>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.email}</p>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.email_verfied ? 'True' : 'False'}</p>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{createdAt}</p>
        <div className=" w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative">
          <p className="text-base text-textColor"> {data.role}</p>
        </div>
        {isLoading && (
            <div className="absolute inset-0 bg-card animate-pulse"></div>
        )}
      </motion.div>
  );
};

export default UserCard;
