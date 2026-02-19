import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout'; 
import { FiTrash2, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      const customersOnly = data.filter(user => user.role !== 'admin');
      setUsers(customersOnly);
      setLoading(false);
    } catch (err) {
      console.error("User Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Kiya aap is customer ka account delete karna chahte hain?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        fetchUsers();
      } catch (err) { console.error("Delete Error:", err); }
    }
  };

  return (
    <AdminLayout title="Customer Management" subtitle={`Total registered customers: ${users.length}`}>
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-[14px]">
            <tr>
              <th className="p-4 font-medium border-b text-center w-20">Avatar</th>
              <th className="p-4 font-medium border-b">Customer Info</th>
              <th className="p-4 font-medium border-b">Joined Date</th>
              <th className="p-4 font-medium border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center animate-pulse text-gray-400">Loading Customers...</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-all">
                <td className="p-4">
                  <div className="w-10 h-10 bg-[#fce9e9] text-[#DB4444] rounded-full flex items-center justify-center mx-auto border border-red-50">
                    <FiUser size={20} />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px]">{user.name}</span>
                    <span className="text-[12px] text-gray-500 flex items-center gap-1"><FiMail size={12} /> {user.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-[13px] text-gray-600 flex items-center gap-2"><FiCalendar size={14} /> {new Date(user.createdAt).toLocaleDateString('en-GB')}</div>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => deleteHandler(user._id)} className="p-2 text-gray-400 hover:text-[#DB4444] hover:bg-red-50 rounded-full transition-all"><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default UserManagement;