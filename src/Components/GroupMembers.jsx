import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getMembersRoute } from "../Utils/APIRoutes";
import { BiArrowBack } from "react-icons/bi";

const GroupMembers = ({
  currentGroup,
  setCurrentPosition,
  setCurrentMember,
  currentUser,
  showChat,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getGroupMembers();
  }, [currentGroup]);

  const getGroupMembers = () => {
    setIsLoading(true);
    axios.post(getMembersRoute, { group: currentGroup._id }).then((res) => {
      const data = res.data;
      const memberIds = data.members.map((member) => member.member);
      console.log(memberIds);
      const outcome = data.users.filter((user) => memberIds.includes(user._id));
      const admin = outcome.find((user) => user._id == currentGroup.admin);
      reArrangeMembers(outcome, admin);
    });
  };

  const reArrangeMembers = (arr, admin) => {
    const targetIndex = arr.indexOf(admin);
    const reArranged = [
      ...arr.slice(targetIndex),
      ...arr.slice(0, targetIndex),
    ];
    setMembers(reArranged);
    setIsLoading(false);
  };

  const viewMemberDetails = (name, id) => {
    if (currentUser._id != id) {
      const selectedMember = members.find((member) => member._id == id);
      setCurrentMember(selectedMember);
      setCurrentPosition(name);
    }
  };

  return (
    <div className="contacts-container px-4">
      <div className="d-flex py-4">
        <div className="back text-white me-2 d-md-none" onClick={showChat}>
          <BiArrowBack size={25} />
        </div>
        <h3 className="text-center text-white w-100">Group Members</h3>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="spinner-border text-light mx-auto" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="contacts">
          {members.map((member) => {
            return (
              <div
                className="contact"
                key={member._id}
                onClick={() => viewMemberDetails("Current Member", member._id)}
              >
                <div className="image">
                  <img src={member.profileImage} alt="picture" />
                </div>
                <div className="username text-white w-100">
                  {member._id == currentGroup.admin ? (
                    <div className="admin">
                      <h5>{member.userName}</h5> <span>admin</span>
                    </div>
                  ) : (
                    <h5>{member.userName}</h5>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupMembers;
