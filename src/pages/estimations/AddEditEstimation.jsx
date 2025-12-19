import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addEstimation, updateEstimation } from '../../store/slices/estimationSlice';
import { estimationsApi } from '../../helpers/mockApi';
import { validateRequired, validateNumber, validatePercentage } from '../../utils/validation';
import { calculateItemTotal, calculateSectionTotal, calculateEstimationTotal } from '../../utils/calculations';
import { formatCurrency } from '../../utils/format';
import { ROUTES } from '../../constants/routes';
import { FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';

const AddEditEstimation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mode } = useSelector((state) => state.theme);
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    version: '',
    project: '',
    client: '',
    status: '',
    sections: [
      {
        id: Date.now().toString(),
        name: 'Sample Section',
        items: [
          {
            id: Date.now().toString() + '-1',
            title: '',
            description: '',
            unit: '',
            quantity: 0,
            price: 0,
            margin: 0,
            total: 0,
          },
        ],
      },
    ],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadEstimation();
    } else {
      // Generate version number for new estimation
      const version = String(Date.now()).slice(-5).padStart(5, '0');
      setFormData(prev => ({ ...prev, version }));
    }
  }, [id]);

  const loadEstimation = async () => {
    try {
      const estimation = await estimationsApi.getById(id);
      if (estimation) {
        setFormData({
          version: estimation.version || '',
          project: estimation.project || estimation.title || '',
          client: estimation.client || '',
          status: estimation.status || '',
          sections: estimation.sections?.length > 0 ? estimation.sections.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
              ...item,
              total: calculateItemTotal(item.quantity, item.price, item.margin),
            })),
          })) : [
            {
              id: Date.now().toString(),
              name: 'Sample Section',
              items: [
                {
                  id: Date.now().toString() + '-1',
                  title: '',
                  description: '',
                  unit: '',
                  quantity: 0,
                  price: 0,
                  margin: 0,
                  total: 0,
                },
              ],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error loading estimation:', error);
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: Date.now().toString(),
          name: 'Sample Section',
          items: [
            {
              id: Date.now().toString() + '-1',
              title: '',
              description: '',
              unit: '',
              quantity: 0,
              price: 0,
              margin: 0,
              total: 0,
            },
          ],
        },
      ],
    });
  };

  const removeSection = (sectionIndex) => {
    if (formData.sections.length > 1) {
      const newSections = formData.sections.filter((_, index) => index !== sectionIndex);
      setFormData({ ...formData, sections: newSections });
    }
  };

  const addItem = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].items.push({
      id: Date.now().toString(),
      title: '',
      description: '',
      unit: '',
      quantity: 0,
      price: 0,
      margin: 0,
      total: 0,
    });
    setFormData({ ...formData, sections: newSections });
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const newSections = [...formData.sections];
    if (newSections[sectionIndex].items.length > 1) {
      newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
        (_, index) => index !== itemIndex
      );
      setFormData({ ...formData, sections: newSections });
    }
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...formData.sections];
    const item = newSections[sectionIndex].items[itemIndex];
    item[field] = value;

    if (field === 'quantity' || field === 'price' || field === 'margin') {
      item.total = calculateItemTotal(
        parseFloat(item.quantity) || 0,
        parseFloat(item.price) || 0,
        parseFloat(item.margin) || 0
      );
    }

    setFormData({ ...formData, sections: newSections });
  };

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(formData.project)) {
      newErrors.project = 'Project is required';
    }
    formData.sections.forEach((section, sIndex) => {
      if (!validateRequired(section.name)) {
        newErrors[`section_${sIndex}`] = 'Section name is required';
      }
      section.items.forEach((item, iIndex) => {
        if (!validateRequired(item.title)) {
          newErrors[`item_${sIndex}_${iIndex}`] = 'Item title is required';
        }
        if (item.quantity && !validateNumber(item.quantity)) {
          newErrors[`quantity_${sIndex}_${iIndex}`] = 'Quantity must be a valid number';
        }
        if (item.price && !validateNumber(item.price)) {
          newErrors[`price_${sIndex}_${iIndex}`] = 'Price must be a valid number';
        }
        if (item.margin && !validatePercentage(item.margin)) {
          newErrors[`margin_${sIndex}_${iIndex}`] = 'Margin must be between 0 and 100';
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const estimationData = {
        version: formData.version,
        project: formData.project,
        client: formData.client,
        status: formData.status || 'Created',
        sections: formData.sections,
        lastModified: new Date().toISOString().split('T')[0],
      };

      if (isEditMode) {
        const updated = await estimationsApi.update(id, estimationData);
        dispatch(updateEstimation(updated));
      } else {
        const newEstimation = await estimationsApi.create(estimationData);
        dispatch(addEstimation(newEstimation));
      }
      navigate(ROUTES.ESTIMATIONS);
    } catch (error) {
      console.error('Error saving estimation:', error);
    } finally {
      setLoading(false);
    }
  };

  const subTotal = formData.sections.reduce((sum, section) => {
    return sum + section.items.reduce((itemSum, item) => {
      return itemSum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0);
  }, 0);

  const totalMargin = formData.sections.reduce((sum, section) => {
    return sum + section.items.reduce((itemSum, item) => {
      const baseTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
      const marginAmount = (baseTotal * (parseFloat(item.margin) || 0)) / 100;
      return itemSum + marginAmount;
    }, 0);
  }, 0);

  const totalAmount = subTotal + totalMargin;

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
            onClick={() => navigate(ROUTES.ESTIMATIONS)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <FiArrowLeft className="text-xl" />
            <span>Back</span>
          </button>
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {isEditMode ? 'Edit Estimates' : 'Add New Estimates'}
          </h1>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} rounded-lg shadow-md p-8`}>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Project
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="Enter project name"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.project ? 'border-red-500' : borderColor
                  }`}
                  required
                />
                {errors.project && (
                  <p className="text-red-500 text-sm mt-1">{errors.project}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Enter client name"
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                >
                  <option value="">Select status</option>
                  <option value="Created">Created</option>
                  <option value="Processing">Processing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="On Hold">On Hold</option>
                  <option value="In Transit">In Transit</option>
                </select>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 mb-8">
              {formData.sections.map((section, sIndex) => {
                const sectionTotal = calculateSectionTotal(section.items);
                const sectionMargin = section.items.reduce((sum, item) => {
                  const baseTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
                  const marginAmount = (baseTotal * (parseFloat(item.margin) || 0)) / 100;
                  return sum + marginAmount;
                }, 0);

                return (
                  <div key={section.id} className={`border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          type="button"
                          onClick={() => addSection()}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <FiPlus />
                        </button>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => handleSectionChange(sIndex, 'name', e.target.value)}
                          placeholder="Section Name"
                          className={`flex-1 px-4 py-2 border rounded-lg ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`section_${sIndex}`] ? 'border-red-500' : borderColor
                          }`}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-4 ml-4">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {formatCurrency(sectionMargin)}
                        </span>
                        {formData.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(sIndex)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <FiMinus />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={`border-b ${borderColor}`}>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>ITEM</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>DESCRIPTION</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>UNIT</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>QUANTITY</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>PRICE ($)</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>MARGIN (+/-)</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}>TOTAL</th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${labelColor} uppercase`}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.items.map((item, iIndex) => (
                            <tr key={item.id} className={`border-b ${borderColor}`}>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'title', e.target.value)}
                                  placeholder="Item Name"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors[`item_${sIndex}_${iIndex}`] ? 'border-red-500' : borderColor
                                  }`}
                                  required
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'description', e.target.value)}
                                  placeholder="Item Description"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={item.unit}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'unit', e.target.value)}
                                  placeholder="Unit"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${borderColor}`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'quantity', parseFloat(e.target.value) || 0)}
                                  placeholder="QTY"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors[`quantity_${sIndex}_${iIndex}`] ? 'border-red-500' : borderColor
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'price', parseFloat(e.target.value) || 0)}
                                  placeholder="Price"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors[`price_${sIndex}_${iIndex}`] ? 'border-red-500' : borderColor
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.margin}
                                  onChange={(e) => handleItemChange(sIndex, iIndex, 'margin', parseFloat(e.target.value) || 0)}
                                  placeholder="Margin %"
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors[`margin_${sIndex}_${iIndex}`] ? 'border-red-500' : borderColor
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={formatCurrency(item.total)}
                                  readOnly
                                  className={`w-full px-3 py-2 border rounded ${inputBg} ${textColor} bg-gray-50 dark:bg-gray-600 ${borderColor}`}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => addItem(sIndex)}
                                    className="p-1 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                                  >
                                    <FiPlus className="text-sm" />
                                  </button>
                                  {section.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeItem(sIndex, iIndex)}
                                      className="p-1 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                                    >
                                      <FiMinus className="text-sm" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={textColor}>Sub Total:</span>
                  <span className={textColor}>{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textColor}>Total Margin:</span>
                  <span className={textColor}>{formatCurrency(totalMargin)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className={textColor}>Total Amount:</span>
                  <span className={textColor}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-start space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : 'SUBMIT'}
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ESTIMATIONS)}
                className={`px-8 py-3 ${cardBg} text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
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

export default AddEditEstimation;

