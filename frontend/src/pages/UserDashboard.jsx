import axios from "axios";
import React, { useEffect, useState } from "react";
import GroupDetails from "../components/GroupDetails";
import CreateGroupModal from "../components/CreateGroupModal";
import AddFriendModal from "../components/AddFriendModal";
import AddItemModal from "../components/AddItemModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import ThemeToggle from "../components/ThemeToggle";

const UserDashboard = () => {
  const [oweMessage, setOweMessage] = useState(null);
  const [groupItems, setGroupItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupForItem, setSelectedGroupForItem] = useState(null);
  const [loginuser, setLoginuser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Pagination & Search States for Expense List
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [newGroup, setNewGroup] = useState({
    roomName: "",
  });
  const [newFriend, setNewFriend] = useState({
    userEmail: "",
    roomName: "",
  });

  const navigate = useNavigate();

  async function getAllGroups() {
    try {
      let { data } = await axios.get(
        `${API_BASE_URL}/roomMates/getAllRoomDetails`,
        { withCredentials: true }
      );
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  async function getloginuserData() {
    try {
      let { data } = await axios.get(
        `${API_BASE_URL}/user/getUserName`,
        { withCredentials: true }
      );
      setLoginuser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function getTotalPrice() {
    try {
      let { data } = await axios.get(
        `${API_BASE_URL}/user/getUserLoggedInAddedItemsSummation`,
        { withCredentials: true }
      );
      setTotalPrice(data.totalSum || 0);
    } catch (error) {
      console.error("Error fetching total price:", error);
    }
  }

  useEffect(() => {
    getTotalPrice();
  }, [showAddItem]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroup.roomName.trim()) {
      try {
        let resp = await axios.post(
          `${API_BASE_URL}/roomMates/createRoom`,
          newGroup,
          { withCredentials: true }
        );
        toast.success("Group created successfully!");
        getAllGroups();
        setNewGroup({ roomName: "" });
        setShowCreateGroup(false);
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error("Failed to create group. Please check backend connection.");
      }
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const accesstoken = sessionStorage.getItem("accesstoken");
    if (!accesstoken) {
      toast.error("You must be logged in to add a friend!");
      return;
    }

    if (newFriend.userEmail.trim() && newFriend.roomName.trim()) {
      try {
        let resp = await axios.get(
          `${API_BASE_URL}/roomMates/addRoomMates/${encodeURIComponent(newFriend.userEmail)}/${encodeURIComponent(newFriend.roomName)}`,
          { withCredentials: true }
        );
        toast.success("Friend added to group!");
        getAllGroups();
        setNewFriend({ userEmail: "", roomName: "" });
        setShowAddFriend(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add friend");
        console.error("Error adding friend:", error);
      }
    }
  };

  const handleAddItem = async (itemData, roomName) => {
    try {
      let resp = await axios.post(
        `${API_BASE_URL}/items/addItems/${encodeURIComponent(roomName)}`,
        itemData,
        { withCredentials: true }
      );
      toast.success(`${itemData.itemsName} Added`);
      setShowAddItem(false);
      setSelectedGroupForItem(null);
      fetchOweInfo();
      fetchGroupItems();
      getTotalPrice();
    } catch (error) {
      toast.error("Error adding item");
      console.error("Error adding item:", error);
    }
  };

  const logoutuser = async () => {
    try {
      let resp = await axios.get(`${API_BASE_URL}/user/userLogout`, {
        withCredentials: true,
      });

      if (resp.status === 200) {
        sessionStorage.removeItem("accesstoken");
        sessionStorage.removeItem("useremail");
        toast.success("Logout success");
        navigate("/login");
      } else {
        toast.error("Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      sessionStorage.removeItem("accesstoken");
      sessionStorage.removeItem("useremail");
      toast.info("Logged out session locally.");
      navigate("/login");
    }
  };

  const fetchGroupItems = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/items/groupItems`, {
        withCredentials: true,
      });
      setGroupItems(data.userItems || []);
    } catch (err) {
      console.error("Error fetching group items", err);
    }
  };

  const fetchOweInfo = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/owe/getOweUserByLoggedUserId`,
        { withCredentials: true }
      );
      const data = response.data;
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
    getloginuserData();
    fetchOweInfo();
    fetchGroupItems();
  }, []);

  const userNameDisplay = loginuser?.name || loginuser?.email || 'User';
  const userInitials = userNameDisplay.substring(0, 2).toUpperCase();

  // Filter items by search term
  const filteredItems = groupItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.itemname && item.itemname.toLowerCase().includes(term)) ||
      (item.username && item.username.toLowerCase().includes(term)) ||
      (item.price && item.price.toString().includes(term))
    );
  });

  // Calculate pagination boundaries
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12 transition-colors duration-300">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Glassmorphic Navigation Bar */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Bill-Buddy Logo"
                className="h-10 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
              <span className="font-black text-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-400 dark:via-violet-300 dark:to-indigo-200 bg-clip-text text-transparent tracking-tight hidden sm:block">
                Bill-Buddy
              </span>
            </div>

            {/* User Info, Theme Toggle & Logout */}
            <div className="flex items-center gap-3 sm:gap-4">
              <ThemeToggle />

              <div className="flex items-center gap-2.5 bg-slate-200/80 dark:bg-slate-800/70 border border-slate-300/80 dark:border-slate-700/60 px-3 py-1.5 rounded-full shadow-inner">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                  {userInitials}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:block pr-1">
                  {userNameDisplay}
                </span>
              </div>

              <button
                onClick={logoutuser}
                className="inline-flex items-center justify-center px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-all shadow-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        
        {/* Page Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/60 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <span>📊 Dashboard Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-300 bg-clip-text text-transparent">{userNameDisplay}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Manage expenses, balance group tabs, and add items seamlessly.
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto relative z-10">
            <button
              onClick={() => setShowAddFriend(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-700 shadow-md text-xs sm:text-sm font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 dark:hover:text-white transition-all hover:-translate-y-0.5"
            >
              <span>👤</span> + Add Friend
            </button>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 shadow-lg shadow-indigo-600/30 text-xs sm:text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all hover:-translate-y-0.5"
            >
              <span>🏠</span> + Create Group
            </button>
          </div>
        </div>

        {/* Financial Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Added Card */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Added By You</dt>
                <dd className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-2xl">₹</span>
                  <span>{totalPrice || 0}</span>
                </dd>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                💵
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              Live tally of items added by your account
            </p>
          </div>

          {/* Owe Status Card */}
          <div
            className={`rounded-3xl border p-6 sm:p-7 shadow-xl relative overflow-hidden transition-all group ${
              oweMessage && oweMessage !== "No one has borrowed money."
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60"
                : "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Roommate Owe Balance</dt>
                <dd
                  className={`text-lg sm:text-xl font-bold ${
                    oweMessage && oweMessage !== "No one has borrowed money."
                      ? "text-amber-800 dark:text-amber-300"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {oweMessage || "No status available"}
                </dd>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform ${
                  oweMessage && oweMessage !== "No one has borrowed money."
                    ? "bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                ⚖️
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
              Calculated dynamically from group splits
            </p>
          </div>
        </div>

        {/* Content Section: Groups and Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Groups List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏠</span> Your Groups
              </h2>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                {groups?.length || 0} Total
              </span>
            </div>

            {groups?.length === 0 ? (
              <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-3">
                <div className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-xl font-bold">
                  +
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active groups</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Get started by creating a new group with your roommates.</p>
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="mt-2 inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md"
                >
                  + Create First Group
                </button>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto space-y-3.5 pr-1">
                {groups?.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all shadow-md hover:shadow-indigo-950/30 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {group.roomName}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                          {group.users?.length || 0} members
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                        {group.description || "Roommate group for shared items and bills."}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGroupForItem(group);
                          setShowAddItem(true);
                        }}
                        className="flex-1 inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Items Data Table with Search & Pagination */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🛒</span> Recent Group Items
                </h2>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                  {filteredItems.length} Total
                </span>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Filter items or users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow-sm placeholder-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between min-h-[420px]">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center space-y-2 my-auto">
                  <div className="text-3xl mb-2">🧾</div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
                    {searchTerm ? "No matching expenses found" : "No items added yet"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {searchTerm
                      ? `Try searching with a different keyword instead of "${searchTerm}".`
                      : "Items added to your groups will appear here in real-time."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Added By
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {currentPaginatedItems.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-200">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                                {item.username ? item.username.substring(0, 1).toUpperCase() : 'U'}
                              </div>
                              <span>{item.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-300">
                            {item.itemname}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-sm font-extrabold text-indigo-600 dark:text-indigo-300 text-right">
                            ₹{item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Pagination Controls Footer */}
              {filteredItems.length > 0 && (
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div>
                    Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {Math.min(startIndex + itemsPerPage, filteredItems.length)}
                    </span>{" "}
                    of <span className="font-bold text-slate-900 dark:text-white">{filteredItems.length}</span> items
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      ← Prev
                    </button>

                    <span className="px-2 font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      Next →
                    </button>
                  </div>
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
