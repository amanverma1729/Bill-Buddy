import axios from "axios";
import React, { useEffect, useState } from "react";
import GroupDetails from "../components/GroupDetails";
import CreateGroupModal from "../components/CreateGroupModal";
import AddFriendModal from "../components/AddFriendModal";
import AddItemModal from "../components/AddItemModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [oweMessage, setOweMessage] = useState(null);
  const [groupItems, setGroupItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupForItem, setSelectedGroupForItem] = useState(null);
  const [loginuser,setLoginuser] = useState(null)
  const [totalPrice,setTotalPrice] = useState(0)
  const [newGroup, setNewGroup] = useState({
    roomName: "",
  });
  const [newFriend, setNewFriend] = useState({
    userEmail: "",
    roomName: "",
  });

  const navigate = useNavigate();

  async function getAllGroups() {
    let { data } = await axios.get(
      "http://localhost:8182/roomMates/getAllRoomDetails",
      { withCredentials: true }
    );
    console.log(data);
    setGroups(data);
  }

  // PUT API TO GET LOGIN USER DATA
  async function getloginuserData() {
    let { data } = await axios.get(
      "http://localhost:8182/user/getUserName",
      { withCredentials: true }
    );
    setLoginuser(data);
  }

  async function getTotalPrice() {
    let { data } = await axios.get(
      "http://localhost:8182/user/getUserLoggedInAddedItemsSummation",
      { withCredentials: true }
    );
    console.log(data);
    setTotalPrice(data.totalSum);
  }

  useEffect(()=>{
        getTotalPrice()
  },[showAddItem])


  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroup.roomName.trim()) {
      try {
        let resp = await axios.post(
          "http://localhost:8182/roomMates/createRoom",
          newGroup,{withCredentials:true}
        );
        console.log(resp);
        getAllGroups();
        setNewGroup({ roomName: "" });
        setShowCreateGroup(false);
      } catch (error) {
        console.log(error);
        console.log("error while creating new group");
      }
    }
  };

  const handleAddFriend = async (e) => {
  e.preventDefault();
  
  // Ensure user is logged in first
  const accesstoken = sessionStorage.getItem("accesstoken");
  if (!accesstoken) {
    toast.error("You must be logged in to add a friend!");
    return;
  }

  if (newFriend.userEmail.trim() && newFriend.roomName.trim()) {
    try {
      let resp = await axios.get(
        `http://localhost:8182/roomMates/addRoomMates/${newFriend.userEmail}/${newFriend.roomName}`,
        { withCredentials: true }
      );
      console.log(resp);
      getAllGroups();
      setNewFriend({ userEmail: "", roomName: "" });
      setShowAddFriend(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error while adding friend");
    }
  }
};


  const handleAddItem = async (itemData, roomName) => {
    try {
      // TODO: Implement the API call to add item
      console.log("Adding item:", itemData);
      let userName = sessionStorage.getItem("useremail");
      let resp = await axios.post(
        `http://localhost:8182/items/addItems/${roomName}`,
        itemData,
        { withCredentials: true }
      );
      toast.success(`${itemData.itemsName} Added`);
      setShowAddItem(false);
      setSelectedGroupForItem(null);
      // 👇 Refresh owe info here
    // Refresh data
    fetchOweInfo();       // existing call
    fetchGroupItems(); 
    } catch (error) {
      console.log("error while adding item:", error);
    }
  };

  const logoutuser = async () => {
  try {
    let resp = await axios.get("http://localhost:8182/user/userLogout", {
      withCredentials: true,
    });
    console.log(resp);

    // Only remove the session if the response is successful
    if (resp.status === 200) {
      sessionStorage.removeItem("accesstoken");
      toast.success("Logout success");
      navigate("/login");
    } else {
      // If status is not 200, log it
      console.log("Logout failed with status: ", resp.status);
      toast.error("Logout failed, please try again.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    
    // Enhanced error handling
    if (error.response) {
      // Server responded with a status other than 200 range
      console.log("Error response: ", error.response);
      toast.error(`Logout failed: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made, but no response received
      console.log("Error request: ", error.request);
      toast.error("Network error. Please check your internet connection.");
    } else {
      // Something happened in setting up the request
      console.log("Error message: ", error.message);
      toast.error(`Logout failed: ${error.message}`);
    }
  }
};

  const fetchGroupItems = async () => {
  try {
    const { data } = await axios.get("http://localhost:8182/items/groupItems", {
      withCredentials: true,
    });
    setGroupItems(data.userItems);
  } catch (err) {
    console.error("Error fetching group items", err);
  }
};

const fetchOweInfo = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8182/owe/getOweUserByLoggedUserId",
      { withCredentials: true }
    );
    const data = response.data;
    
    // Format the message
    const message = `${data.borrowMessage}${data.money}₹${data.lendMessage}`;
    setOweMessage(message);
  } catch (error) {
    if (error.response?.status === 204) {
      setOweMessage("No one has borrowed money.");
    } else {
      console.error("Error fetching owe info:", error);
    }
  }
};



useEffect(() => {
      getAllGroups();
      getloginuserData()

  fetchOweInfo();
  fetchGroupItems();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div>
            <button 
            onClick={logoutuser}
            className="bg-red-400 mr-2 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-500 transition-all duration-300 transform hover:scale-105">
              Logout
            </button>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Friend Section - Moved to top on mobile */}
          <div className="col-span-2 md:col-span-1 order-first md:order-last">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button
                onClick={() => setShowAddFriend(true)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Add Friend
              </button>
            </div>
          </div>

          {/* Groups Section */}
          <div className="col-span-2 order-last md:order-first">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between">
                Your Groups

                <div className="">
                  <div>Welcome, <span>{loginuser?.name}</span></div>
                  <p className="text-gray-400 text-sm text-end">Total Amount Added By You = <span>{totalPrice}</span></p>
                </div>
              </h2>
              {groups?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No groups yet. Create one to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {groups?.map((group) => (
                    <div
                      key={group.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">
                        {group.roomName}
                      </h3>
                      <p className="text-gray-600 mt-1">{group.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {group.users.length} members
                        </span>
                        <div className="space-x-2 flex flex-col md:flex-row">
                          <button
                            onClick={() => {
                              setSelectedGroupForItem(group);
                              setShowAddItem(true);
                            }}
                            className="text-green-500  hover:text-green-700 font-medium"
                          >
                            Add Item
                          </button>
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="text-purple-600 hover:text-purple-700 font-medium  "
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {oweMessage && (
  <div className="bg-yellow-100 mt-10 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-sm">
    <p className="font-medium">{oweMessage}</p>
  </div>
)}
        {/* Group Items Table */}
<div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Group Items</h2>
  {groupItems.length === 0 ? (
    <p className="text-gray-500">No items found.</p>
  ) : (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="px-4 py-2 border">Username</th>
          <th className="px-4 py-2 border">Item Name</th>
          <th className="px-4 py-2 border">Price</th>
        </tr>
      </thead>
      <tbody>
        {groupItems.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-2 border">{item.username}</td>
            <td className="px-4 py-2 border">{item.itemname}</td>
            <td className="px-4 py-2 border">₹{item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
      </div>

      {/* Modals */}

      <CreateGroupModal
        show={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSubmit={handleCreateGroup}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
      />

      <AddFriendModal
        show={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onSubmit={handleAddFriend}
        newFriend={newFriend}
        setNewFriend={setNewFriend}
      />

      <AddItemModal
        show={showAddItem}
        onClose={() => {
          setShowAddItem(false);
          setSelectedGroupForItem(null);
        }}
        onSubmit={handleAddItem}
        group={selectedGroupForItem}
      />

      {selectedGroup && (
        <GroupDetails
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
