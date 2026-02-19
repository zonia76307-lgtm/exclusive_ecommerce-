import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiSave, FiRefreshCw, FiPercent } from 'react-icons/fi';
import AdminLayout from './AdminLayout'; 

const FlashSalesManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.user);
  
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (err) { toast.error("Fetch failed"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleToggleSale = (id) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, onSale: !p.onSale } : p));
  };

  const handleDiscountChange = (id, value) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, discountPercentage: parseInt(value) || 0 } : p));
  };

  const saveSaleStatus = async (product) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        onSale: product.onSale,
        discountPercentage: product.discountPercentage
      }, config);
      toast.success(`${product.name} updated!`);
      fetchProducts(); 
    } catch (err) { toast.error("Update fail"); }
  };

  return (
    <AdminLayout title="Offers" subtitle="Manage product discounts">
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100 mx-4">
        <div className="p-4 flex justify-end bg-gray-50/50 border-b">
          <button onClick={fetchProducts} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-[#DB4444]">
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> REFRESH
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 text-[11px] font-black uppercase text-gray-400">Product</th>
                <th className="p-4 text-[11px] font-black uppercase text-gray-400">Price</th>
                <th className="p-4 text-[11px] font-black uppercase text-gray-400 text-center">Status</th>
                <th className="p-4 text-[11px] font-black uppercase text-gray-400">Discount %</th>
                <th className="p-4 text-[11px] font-black uppercase text-gray-400">Final</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className={`hover:bg-gray-50/30 ${p.onSale ? 'bg-red-50/10' : ''}`}>
                  <td className="p-4 flex items-center gap-3">
                    <img src={`http://localhost:5000${p.image}`} className="w-8 h-8 object-contain border rounded" alt="" />
                    <span className="font-bold text-sm text-gray-800">{p.name}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-400 text-xs">${p.price}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleSale(p._id)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${p.onSale ? 'bg-[#DB4444]' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.onSale ? 'left-6' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <input 
                      type="number" 
                      disabled={!p.onSale}
                      value={p.discountPercentage}
                      onChange={(e) => handleDiscountChange(p._id, e.target.value)}
                      className="w-12 border-b-2 outline-none font-bold text-center text-sm disabled:text-gray-200 focus:border-[#DB4444]"
                    />
                  </td>
                  <td className="p-4 font-black text-sm text-[#DB4444]">
                    ${p.onSale ? (p.price - (p.price * p.discountPercentage / 100)).toFixed(0) : p.price}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => saveSaleStatus(p)} className="bg-black text-white px-3 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#DB4444] transition-all"><FiSave size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FlashSalesManager;