import React from "react";

const GroupDetails = ({ group, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{group.roomName}</h2>
            <p className="text-sm text-slate-500 mt-1">Group Details & Activity</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-2 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-8 bg-white">
          
          {/* Members Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold mr-2">
                {group.users?.length || 0}
              </span>
              Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.users?.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-semibold text-sm">
                      {user.name
                        ? user.name[0].toUpperCase()
                        : user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">
                      {user.name || "No Name"}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold mr-2">
                {group.items?.length || 0}
              </span>
              Items Shared
            </h3>
            {group.items && group.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-slate-200 rounded-lg flex justify-between items-center hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div className="min-w-0 pr-4">
                      <h4 className="font-medium text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        Added by: {item.addedBy}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-emerald-600 shrink-0">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 border border-slate-200 border-dashed rounded-lg">
                <p className="text-sm text-slate-500">No items have been added to this group yet.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;

