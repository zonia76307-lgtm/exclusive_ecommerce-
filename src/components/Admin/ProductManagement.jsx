import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AdminLayout from './AdminLayout'; 
import { FiPlus, FiTrash2, FiEdit, FiX, FiMoreVertical } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', countInStock: '', description: '', discountPercentage: 0, onSale: false });

  const { userInfo } = useSelector((state) => state.user);
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/categories')
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    fetchData(); 
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      const uploadConfig = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo?.token}` } };
      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, data, uploadConfig);
        toast.success('Updated! ✨');
      } else {
        await axios.post('http://localhost:5000/api/products', data, uploadConfig);
        toast.success('Added! 📦');
      }
      setIsModalOpen(false); setEditId(null); setImageFile(null); fetchData();
    } catch (err) { toast.error('Error saving!'); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      toast.success('Deleted!');
      fetchData();
    } catch (err) { toast.error('Error!'); }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Products</h2>
          <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-[#DB4444] text-white px-6 py-3 font-bold text-xs uppercase shadow-lg hover:bg-black transition-all flex items-center justify-center">
            <FiPlus size={20} className="mr-2" /> Add New
          </button>
        </div>

        <div className="bg-white border rounded-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-100 text-[11px] font-bold uppercase text-gray-500 border-b">
                <tr>
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4"><img src={`http://localhost:5000${p.image}`} className="w-10 h-10 object-contain border bg-white" alt=""/></td>
                    <td className="p-4 font-bold text-gray-800 uppercase text-xs">{p.name}</td>
                    <td className="p-4 text-[10px] font-black uppercase text-gray-400">{p.category}</td>
                    <td className="p-4 font-bold">{p.countInStock}</td>
                    <td className="p-4 font-black">${p.price}</td>
                    <td className="p-4 text-right relative">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p._id ? null : p._id); }} className="p-2 hover:bg-gray-100 rounded-full"><FiMoreVertical size={18} /></button>
                      {activeMenu === p._id && (
                        <div className="absolute right-12 top-0 bg-white shadow-2xl border rounded-md z-[100] w-32 py-1">
                          <button onClick={() => { setEditId(p._id); setFormData(p); setIsModalOpen(true); }} className="w-full px-4 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 text-left">EDIT</button>
                          <button onClick={() => handleDelete(p._id)} className="w-full px-4 py-2 text-[10px] font-bold text-red-600 hover:bg-red-50 text-left">DELETE</button>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-2 md:p-4">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-sm w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-black transition-all"><FiX size={28}/></button>
            <h2 className="text-xl font-black mb-8 border-b pb-4 uppercase italic">Product Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Name</label>
                  <input type="text" className="w-full border-b-2 py-2 outline-none focus:border-[#DB4444] font-bold uppercase text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Category</label>
                  <select className="w-full border-b-2 py-2 bg-white font-bold outline-none focus:border-[#DB4444] uppercase text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Description</label>
                  <textarea className="w-full border-2 p-2 outline-none focus:border-[#DB4444] h-24 text-xs rounded-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Price ($)</label>
                    <input type="number" className="w-full border-b-2 py-2 font-bold text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="w-1/2">
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Stock</label>
                    <input type="number" className="w-full border-b-2 py-2 font-bold text-sm" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Product Image</label>
                  <input type="file" className="text-[10px]" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#DB4444] text-white py-4 font-black uppercase mt-10 hover:bg-black transition-all text-sm tracking-widest">
              {editId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagement;