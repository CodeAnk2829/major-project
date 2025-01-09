import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import SearchBar from "../components/SearchBar";
import ComplaintCard from "../components/ComplaintCard";

const Home = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const res = await fetch("/api/v1/complaint/all");
      const data = await res.json();
      console.log(data);
      setComplaints(data.complaints);
    };
    fetchComplaints();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="w-3/4 flex flex-col px-6 py-4">
        <div className="mb-8">
          <SearchBar />
        </div>
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {complaints && complaints.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Complaints
              </h2>
              <div className="flex flex-col gap-4">
                {complaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
