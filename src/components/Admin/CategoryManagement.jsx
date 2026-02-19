import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout'; 
import { FiPlus, FiEdit, FiTrash2, FiX, FiMoreVertical, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const BASE_URL = "http://localhost:5000";

  const config = { 
    headers: { 
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userInfo?.token}` 
    } 
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    fetchCategories();
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryName);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingCategory) {
        await axios.put(`${BASE_URL}/api/categories/${editingCategory._id}`, formData, config);
        toast.success('Category Updated! ✨');
      } else {
        await axios.post(`${BASE_URL}/api/categories`, formData, config);
        toast.success('Category Created! 🚀');
      }
      setIsModalOpen(false); 
      setEditingCategory(null); setCategoryName(''); setImageFile(null);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving!'); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`, { headers: { Authorization: `Bearer ${userInfo?.token}` } });
      toast.success('Category Deleted! 🗑️');
      fetchCategories();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setImageFile(null);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">Categories</h2>
          <button 
            onClick={() => { setEditingCategory(null); setCategoryName(''); setImageFile(null); setIsModalOpen(true); }} 
            className="w-full sm:w-auto bg-[#DB4444] text-white px-6 py-3 font-bold text-xs uppercase shadow-lg hover:bg-black transition-all flex items-center justify-center"
          >
            <FiPlus size={20} className="mr-2" /> Add New
          </button>
        </div>

        <div className="bg-white border rounded-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-gray-100 text-[11px] font-bold uppercase text-gray-400 border-b">
                <tr>
                  <th className="p-4 w-24 text-center">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 mx-auto flex items-center justify-center border bg-white rounded-md overflow-hidden shadow-sm">
                        {cat.image ? (
                          <img src={`${BASE_URL}${cat.image}`} alt={cat.name} className="w-full h-full object-contain" />
                        ) : (
                          <FiImage className="text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800 uppercase tracking-tight text-sm md:text-base">{cat.name}</td>
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === cat._id ? null : cat._id); }}
                        className="p-2 hover:bg-gray-200 rounded-full"
                      >
                        <FiMoreVertical size={20} className="text-gray-600" />
                      </button>

                      {activeMenu === cat._id && (
                        <div className="absolute right-12 top-0 bg-white shadow-2xl border rounded-md z-[100] w-36 py-2 border-gray-100">
                          <button onMouseDown={() => handleEditClick(cat)} className="flex items-center gap-3 w-full px-4 py-2 text-[11px] font-bold text-blue-600 hover:bg-blue-50 uppercase"><FiEdit /> Edit</button>
                          <button onMouseDown={() => handleDelete(cat._id)} className="flex items-center gap-3 w-full px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 uppercase"><FiTrash2 /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white p-6 md:p-8 w-full max-w-md relative shadow-2xl rounded-sm">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-black"><FiX size={24}/></button>
            <h2 className="text-2xl font-black mb-8 border-b pb-4 uppercase italic tracking-tighter text-black">Category Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Name</label>
                <input type="text" className="w-full border-b-2 p-2 outline-none focus:border-[#DB4444] font-bold uppercase" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Category Image</label>
                <input type="file" accept="image/*" className="w-full text-sm" onChange={(e) => setImageFile(e.target.files[0])} required={!editingCategory} />
              </div>
              <button type="submit" className="w-full bg-[#DB4444] text-white py-4 font-black uppercase hover:bg-black transition-all shadow-xl text-sm">
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoryManagement;