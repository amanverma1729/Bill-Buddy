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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BB</span>
                </div>
                <span className="font-bold text-xl text-slate-900 hidden sm:block">Bill-Buddy</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <span className="text-sm text-slate-500 mr-2">Welcome,</span>
                <span className="text-sm font-medium text-slate-900">{loginuser?.name || 'User'}</span>
              </div>
              <button
                onClick={logoutuser}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddFriend(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Add Friend
            </button>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
            <dt className="text-sm font-medium text-slate-500 truncate">Total Amount Added By You</dt>
            <dd className="mt-2 text-3xl font-semibold text-slate-900">₹{totalPrice || 0}</dd>
          </div>
          
          <div className={`rounded-xl shadow-sm border p-6 flex flex-col justify-center ${oweMessage && oweMessage !== "No one has borrowed money." ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
            <dt className="text-sm font-medium text-slate-500 truncate">Owe Status</dt>
            <dd className={`mt-2 text-lg font-medium ${oweMessage && oweMessage !== "No one has borrowed money." ? "text-amber-800" : "text-slate-900"}`}>
              {oweMessage || "No status available"}
            </dd>
          </div>
        </div>

        {/* Two Column Layout for Groups and Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Groups List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Your Groups</h2>
            
            {groups?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="mx-auto h-12 w-12 text-slate-400 mb-3 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-xl">+</span>
                </div>
                <h3 className="text-sm font-medium text-slate-900">No groups</h3>
                <p className="mt-1 text-sm text-slate-500">Get started by creating a new group.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups?.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-slate-900 truncate pr-2">
                        {group.roomName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {group.users?.length || 0} members
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                      {group.description || "No description provided."}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGroupForItem(group);
                          setShowAddItem(true);
                        }}
                        className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Items Data Table */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Group Items</h2>
            
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
              {groupItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No items have been added to your groups yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Added By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {groupItems.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {item.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {item.itemname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 text-right">
                            ₹{item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>

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
