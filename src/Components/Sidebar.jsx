import React, { useEffect, useState } from "react";
import { db } from "../config/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
    console.log("from useEffect");
  }, []);
  console.log("alo");
  return (
    <div className="w-64 bg-white p-4 shadow-lg h-screen sticky top-0">
      <h2 className="text-2xl font-semibold mb-4">Our Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid} className="mb-2">
            <Link
              to={`/profile/${user.uid}`}
              className="flex items-center gap-3"
            >
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{user.displayName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
