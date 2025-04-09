import React from 'react';

export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const UserAvatar = ({ name }) => {
    const initials = getInitials(name);
    const colors = [
        'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500',
        'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-teal-500'
    ];

    const colorIndex = name ?
        name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;

    return (
        <div className={`${colors[colorIndex]} w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md`}>
            {initials}
        </div>
    );
};

export default UserAvatar;
