import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, updateProject } from '../../store/slices/projectSlice';
import { projectsApi } from '../../helpers/mockApi';
import { validateRequired } from '../../utils/validation';
import { ROUTES } from '../../constants/routes';
import { FiArrowLeft } from 'react-icons/fi';

const AddEditProject = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mode } = useSelector((state) => state.theme);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    customer: '',
    refNumber: '',
    projectName: '',
    projectNumber: '',
    areaLocation: '',
    address: '',
    status: '',
    dueDate: '',
    contact: '',
    manager: '',
    staff: '',
    email: '',
    comments: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const project = await projectsApi.getById(id);
      if (project) {
        setFormData({
          customer: project.customer || '',
          refNumber: project.refNumber || '',
          projectName: project.projectName || '',
          projectNumber: project.projectNumber || '',
          areaLocation: project.areaLocation || '',
          address: project.address || '',
          status: project.status || '',
          dueDate: project.dueDate || '',
          contact: project.contact || '',
          manager: project.manager || '',
          staff: project.staff || '',
          email: project.email || '',
          comments: project.comments || '',
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(formData.customer)) {
      newErrors.customer = 'Customer is required';
    }
    if (!validateRequired(formData.refNumber)) {
      newErrors.refNumber = 'Ref Number is required';
    }
    if (!validateRequired(formData.projectName)) {
      newErrors.projectName = 'Project Name is required';
    }
    if (!validateRequired(formData.projectNumber)) {
      newErrors.projectNumber = 'Project Number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode) {
        const updated = await projectsApi.update(id, formData);
        dispatch(updateProject(updated));
      } else {
        const newProject = await projectsApi.create(formData);
        dispatch(addProject(newProject));
      }
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-white' : 'text-gray-900';
  const labelColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBg = mode === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = mode === 'dark' ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`min-h-screen ${bgColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(ROUTES.PROJECTS)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <FiArrowLeft className="text-xl" />
            <span>Back</span>
          </button>
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </h1>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} rounded-lg shadow-md p-8`}>
          <form onSubmit={handleSubmit}>
            <div className={`grid ${isEditMode ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
              {/* Customer */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Customer
                </label>
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customer ? 'border-red-500' : borderColor
                  }`}
                  required
                >
                  <option value="">Select customer</option>
                  <option value="Olivia Martin">Olivia Martin</option>
                  <option value="Michael Jones">Michael Jones</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Ella Lewis">Ella Lewis</option>
                  <option value="James Rodriguez">James Rodriguez</option>
                  <option value="Isabella Anderson">Isabella Anderson</option>
                  <option value="Sarah Williams">Sarah Williams</option>
                  <option value="Sophia Hernandez">Sophia Hernandez</option>
                  <option value="Ruchika Heer">Ruchika Heer</option>
                </select>
                {errors.customer && (
                  <p className="text-red-500 text-sm mt-1">{errors.customer}</p>
                )}
              </div>

              {/* Reference Number */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Reference Number
                </label>
                <input
                  type="text"
                  name="refNumber"
                  value={formData.refNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your reference number"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.refNumber ? 'border-red-500' : borderColor
                  }`}
                  required
                />
                {errors.refNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.refNumber}</p>
                )}
              </div>

              {/* Project Name */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter your project name"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectName ? 'border-red-500' : borderColor
                  }`}
                  required
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                )}
              </div>

              {/* Project Number */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Project Number
                </label>
                <input
                  type="text"
                  name="projectNumber"
                  value={formData.projectNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your project number"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectNumber ? 'border-red-500' : borderColor
                  }`}
                  required
                />
                {errors.projectNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectNumber}</p>
                )}
              </div>

              {/* Area Location */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Area Location
                </label>
                <input
                  type="text"
                  name="areaLocation"
                  value={formData.areaLocation}
                  onChange={handleInputChange}
                  placeholder="Enter your project area location"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your project address"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                />
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    placeholder="Select Due Date"
                    className={`w-full px-4 py-3 pr-10 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                  />
                  <svg
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter your contact"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                />
              </div>

              {/* Manager */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Manager
                </label>
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                >
                  <option value="">Select project manager</option>
                  <option value="Aman Parvez">Aman Parvez</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Michael Brown">Michael Brown</option>
                </select>
              </div>

              {/* Staff */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Staff
                </label>
                <select
                  name="staff"
                  value={formData.staff}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                >
                  <option value="">Select project staff</option>
                  <option value="Rohit Balakrishna">Rohit Balakrishna</option>
                  <option value="Emma Wilson">Emma Wilson</option>
                  <option value="David Lee">David Lee</option>
                  <option value="Lisa Chen">Lisa Chen</option>
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                >
                  <option value="">Select project status</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="On Hold">On Hold</option>
                  <option value="In Transit">In Transit</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-start space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : isEditMode ? 'Update Now' : 'Add Now'}
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.PROJECTS)}
                className={`px-6 py-3 ${cardBg} text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProject;

