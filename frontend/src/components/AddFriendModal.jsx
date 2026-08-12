import React from "react";

const AddFriendModal = ({
  show,
  onClose,
  onSubmit,
  newFriend,
  setNewFriend,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">
            Add Friend to Group
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Invite a friend to an existing group via email.
          </p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label
                htmlFor="userEmail"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Friend's Email
              </label>
              <input
                type="email"
                id="userEmail"
                value={newFriend.userEmail}
                onChange={(e) =>
                  setNewFriend({ ...newFriend, userEmail: e.target.value })
                }
                className="appearance-none block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="friend@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Group Name
              </label>
              <input
                type="text"
                id="roomName"
                value={newFriend.roomName}
                onChange={(e) =>
                  setNewFriend({ ...newFriend, roomName: e.target.value })
                }
                className="appearance-none block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Goa Trip"
                required
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Friend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFriendModal;
