import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import profile from "../asset/groupImage.png";
import {
  addMemberRoute,
  createGroupRoute,
  getGroupsRoute,
} from "../Utils/APIRoutes";

const Groups = ({ currentUser, setGroupMode, showChat,setCurrentGroup }) => {
  const inputRef = useRef();
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const changeCurrentChat = (group, id) => {
    setCurrentSelected(id);
  setCurrentGroup(group)
    setGroupMode(true);
    showChat();
  };

  const showCreateGroup = () => {
    document.querySelector(".first").classList.add("d-none");
    document.querySelector(".second").classList.remove("d-none");
    document.querySelector(".second").classList.add("d-flex");
    inputRef.current.focus();
  };

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = () => {
    setIsLoading(true);
    axios
      .post(getGroupsRoute, {
        member: currentUser._id,
      })
      .then((res) => {
        const data = res.data;
        const groupsIds = data.whereIAmAMember.map((member) => member.group);
        const groupsIBelong = data.Groups.filter((group) =>
          groupsIds.includes(group._id)
        );
        setGroups(groupsIBelong);
        setIsLoading(false);
      });
  };
  const save = async () => {
    if (inputRef.current.value != "") {
      const { data } = axios.post(createGroupRoute, {
        name: inputRef.current.value,
        admin: currentUser._id,
      });
      if (data.success) {
        document.querySelector(".first").classList.remove("d-none");
        document.querySelector(".second").classList.remove("d-flex");
        document.querySelector(".second").classList.add("d-none");
        const firstMember = {
          member: currentUser._id,
          group: data.data._id,
        };
        const response = await axios.post(addMemberRoute, firstMember);
        getGroups();
        inputRef.current.value = "";
        console.log(response);
      }
    }
  };

  const cancel = () => {
    document.querySelector(".first").classList.remove("d-none");
    document.querySelector(".second").classList.remove("d-flex");
    document.querySelector(".second").classList.add("d-none");
  };

  return (
    <div className="contacts-container px-4 pt-md-0 pt-4">
      <h3 className="text-center text-white py-4 d-none d-md-block">Groups</h3>
      <div className="my-4">
        <button
          className="first btn btn-success w-100 mx-auto"
          onClick={showCreateGroup}
        >
          Create Group
        </button>
        <div className="second d-none mx-2">
          <IoMdCloseCircle
            onClick={cancel}
            size={40}
            className="text-danger mt-4"
          />
          <div className="form-floating text-white w-100 mx-2">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              name=""
              id="floatingInput"
              placeholder="Create new group"
            />
            <label htmlFor="floatingInput">New Group</label>
          </div>
          <IoMdCheckmarkCircle
            onClick={save}
            size={40}
            className="text-success mt-4"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border text-light mx-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="contacts">
          {groups.length == 0 ? (
            <div className="text-white text-center">
              <h5>You've not been added to any group. Create a group!</h5>
            </div>
          ) : (
            groups.map((group) => {
              return (
                <div
                  className={`contact w-100 ${
                    currentSelected === group._id ? "selected" : null
                  }`}
                  key={group._id}
                  onClick={() => changeCurrentChat(group, group._id)}
                >
                  <div className="image">
                    <img src={group.profileImage} alt="picture" />
                  </div>
                  <div className="username text-white">
                    <h4 className="">{group.name}</h4>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
