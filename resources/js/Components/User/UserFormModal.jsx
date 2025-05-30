import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

const UserFormModal = ({ isOpen, onClose, user = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role_id: '',
        permissions: [],
    });
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            axios.get('/roles').then(res => setRoles(res.data));
            axios.get('/permissions').then(res => setPermissions(res.data));
        }
    }, [isOpen]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                phone: user.phone || '',
                role_id: user.roles?.[0]?.id || '',
                permissions: user.permissions?.map(p => p.id) || [],
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                role_id: '',
                permissions: [],
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        if (type === 'select-multiple') {
            setFormData({
                ...formData,
                [name]: Array.from(selectedOptions, option => option.value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!user && !formData.password.trim()) newErrors.password = 'Password is required for new users';
        else if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.role_id) newErrors.role_id = 'Role is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = { ...formData };
            if (user && !formData.password) delete submitData.password;
            onSubmit(submitData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-2xl w-full max-w-md"
            >
                <div className="p-4 bg-blue-800 text-white rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold">
                        {user ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-blue-800 focus:border-blue-800 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-blue-800 focus:border-blue-800 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password {user && <span className="text-xs text-gray-500">(Leave blank to keep current password)</span>}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-blue-800 focus:border-blue-800 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                name="role_id"
                                value={formData.role_id}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:ring-blue-800 focus:border-blue-800 ${errors.role_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                            {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                            <select
                                name="permissions"
                                multiple
                                value={formData.permissions}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-800 focus:border-blue-800"
                            >
                                {permissions.map(permission => (
                                    <option key={permission.id} value={permission.id}>{permission.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            {user ? 'Update User' : 'Add User'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserFormModal;
