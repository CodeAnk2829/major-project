import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ComplaintCard from "../components/ComplaintCard";
import { Spinner } from "flowbite-react";
import SideBar from "../components/SideBar";

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true); // Start the loading state
      try {
        const res = await fetch("/api/v1/complaint/all");
        if (!res.ok) {
          throw new Error(
            "Failed to fetch complaints. Please try again later."
          );
        }
        const data = await res.json();
        if (!data.complaintResponse) {
          throw new Error("Unexpected response format.");
        }
        setComplaints(data.complaintResponse);
      } catch (error) {
        console.error("Error fetching complaints:", error.message);
        setComplaints([]); // Set complaints to an empty array in case of error
      } finally {
        setLoading(false); // Ensure loading stops regardless of success or failure
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        <div className="md:visible mb-8">
          <SearchBar />
        </div>
        {loading ? (
          // Loading spinner
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" className="fill-[rgb(60,79,131)]" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {complaints && complaints.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibold text-center">
                  Recent Complaints
                </h2>
                <div className="flex flex-col gap-4">
                  {complaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No complaints found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
