import React from "react";

const AddItemModal = ({ show, onClose, onSubmit, group }) => {
  const [itemData, setItemData] = React.useState({
    itemsName: "",
    price: "",
  });

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(itemData, group.roomName);
    setItemData({ itemsName: "", price: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">
            Add Item to {group.roomName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Enter the details of the item to split with the group.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                value={itemData.itemsName}
                onChange={(e) =>
                  setItemData({ ...itemData, itemsName: e.target.value })
                }
                className="appearance-none block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Dinner at Taj"
                required
              />
            </div>
            <div>
              <label
                htmlFor="itemPrice"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Price (₹)
              </label>
              <input
                type="number"
                id="itemPrice"
                value={itemData.price}
                onChange={(e) =>
                  setItemData({ ...itemData, price: e.target.value })
                }
                className="appearance-none block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0.00"
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
