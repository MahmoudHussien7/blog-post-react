import React from "react";

const SearchResults = () => {
  // في صفحة نتائج البحث (SearchPage.jsx أو ما يعادلها)
  const { state } = useLocation();
  const { posts, profiles } = state || { posts: [], profiles: [] };

  // عرض البيانات
  return (
    <div>
      <h1>Search Results</h1>
      <h2>Posts:</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
      <h2>Profiles:</h2>
      {profiles.map((profile) => (
        <div key={profile.id}>
          <h3>{profile.displayName}</h3>
        </div>
      ))}
    </div>
  );
};

//   return (
//     <div>
//       <div className="min-h-screen bg-gray-100">
//         <Navbar />
//         <div className="container mx-auto py-8 px-4">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">
//             Search Results
//           </h1>

//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.length > 0 ? (
//               posts.map((post) => (
//                 <div
//                   key={post.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden"
//                 >
//                   {post.image && (
//                     <img
//                       className="w-full h-48 object-cover"
//                       src={post.image}
//                       alt={post.title}
//                     />
//                   )}
//                   <div className="p-4">
//                     <h3 className="text-xl font-semibold text-gray-700">
//                       {post.title}
//                     </h3>
//                     <p className="text-gray-600 mt-2">{post.content}</p>
//                     <p className="text-gray-500 text-sm mt-2">
//                       {new Date(post.date).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No posts found.</p>
//             )}
//           </div>

//           <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
//             Profiles
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {profiles.length > 0 ? (
//               profiles.map((profile) => (
//                 <div
//                   key={profile.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden"
//                 >
//                   {profile.photoURL ? (
//                     <img
//                       className="w-24 h-24 rounded-full object-cover mx-auto mt-4"
//                       src={profile.photoURL}
//                       alt={profile.displayName}
//                     />
//                   ) : (
//                     <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mt-4 flex items-center justify-center">
//                       <FaUser className="text-gray-500 text-3xl" />
//                     </div>
//                   )}
//                   <div className="p-4 text-center">
//                     <h3 className="text-xl font-semibold text-gray-700">
//                       {profile.displayName}
//                     </h3>
//                     <p className="text-gray-600 mt-2">{profile.email}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-600">No profiles found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default SearchResults;
