import React, { useEffect, useState } from 'react';
import { fetchUsersBySearchTerm } from '../api/facetedSearch'; // Fetch function for users

const UserList = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await fetchUsersBySearchTerm(searchTerm); 
        setUsers(users); // Set the user list with fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    if (searchTerm && searchTerm.length > 0) {
      fetchUsers(); // Fetch users if searchTerm is not empty
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-orange-400 font-zina text-3xl font-bold mb-4">Users matching: {searchTerm}</h2>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow rounded p-4">
              <p className="text-black font-recia">{user.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default UserList;
