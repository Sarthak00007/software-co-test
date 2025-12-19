import { useState } from 'react';

const SelectStatusModal = ({ isOpen, onClose, onApply, selectedStatuses }) => {
  const [localSelected, setLocalSelected] = useState(selectedStatuses || []);

  const statuses = [
    { key: 'Completed', label: 'Completed' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Rejected', label: 'Rejected' },
    { key: 'On Hold', label: 'On Hold' },
    { key: 'In Transit', label: 'In Transit' },
  ];

  const handleToggle = (status) => {
    if (localSelected.includes(status)) {
      setLocalSelected(localSelected.filter(s => s !== status));
    } else {
      setLocalSelected([...localSelected, status]);
    }
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Status</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {statuses.map((status) => {
                const isSelected = localSelected.includes(status.key);
                return (
                  <button
                    key={status.key}
                    onClick={() => handleToggle(status.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400'
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You can choose multiple status
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectStatusModal;

