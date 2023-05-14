import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { motion } from "framer-motion";
import { getAllUsers } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import UserCard from "./UserCard";

const DashboardUsers = () => {
  const [emailFilter, setEmailFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const [filterUsers, setFilterUsers] = useState(null);

  const [{ allUsers }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data?.data,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (emailFilter) {
      const filtered = allUsers.filter(
          // prettier-ignore
          (data) =>  data.email.includes(emailFilter) || data.name.includes(emailFilter) || data.role.includes(emailFilter)
      );
      setFilterUsers(filtered);
    }
  }, [emailFilter]);

  return (
      <div className="w-full p-4 flex items-center justify-center flex-col">
        <div className="w-full flex gap-24">
          <input
              type="text"
              placeholder="Search here"
              className={`w-52 px-4 py-2 bg-almostDark ${
                  isFocus ? "bg-zinc-950 shadow-lg" : "bg-zinc-800"
              } rounded-full bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor`}
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              onBlur={() => setIsFocus(false)}
              onFocus={() => setIsFocus(true)}
          />

          {emailFilter && (
              <motion.i
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.75 }}
                  onClick={() => {
                    setEmailFilter("");
                    setFilterUsers(null);
                  }}
              >
                <AiOutlineClear className="text-3xl text-gray-400 cursor-pointer" />
              </motion.i>
          )}
        </div>

        <div className="relative w-full py-4 min-h-[400px] overflow-x-scroll no-scrollbar my-4 flex flex-col items-center justify-start p-4 bg-zinc-800 rounded-md gap-3">
          <div className=" relative w-full min-w-[750px] py-6 bg-zinc-950 flex items-center justify-between">
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Image</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Name</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Email</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Verified</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Created</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Role</p>{" "}
          </div>
          {allUsers && !filterUsers
              ? allUsers?.map((data, i) => (
                  <UserCard data={data} key={data._id} index={i} />
              ))
              : filterUsers?.map((data, i) => (
                  <UserCard data={data} key={data._id} index={i} />
              ))}
          <div className="absolute bottom-4 right-4">
            <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Count : &nbsp; {filterUsers ? filterUsers?.length : allUsers?.length}
            </span>

            </p>
          </div>
        </div>
      </div>
  );
};

export default DashboardUsers;
