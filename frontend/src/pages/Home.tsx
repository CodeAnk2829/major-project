import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ComplaintCard from "../components/ComplaintCard";
import { Spinner } from "flowbite-react";
import SideBar from "../components/SideBar";
import ScrollToTop from "react-scroll-to-top";
import { FaChevronUp } from "react-icons/fa";

const Home = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvotedComplaints, setUpvotedComplaints] = useState<string[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true); // Start the loading state
      try {
        const res = await fetch("/api/v1/complaint/get-all");
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
        setUpvotedComplaints(data.upvotedComplaints.map((c: any) => c.complaintId));
      } catch (error) {
        console.error("Error fetching complaints:", error.message);
        setComplaints([]); // Set complaints to an empty array in case of error
      } finally {
        setLoading(false); // Ensure loading stops regardless of success or failure
      }
    };

    fetchComplaints();
  }, []);

  const handleUpvote = async (complaintId) => {
    console.log("Upvote clicked for complaint with complaint id: ", complaintId);
    try {
      const res = await fetch(`/api/v1/complaint/upvote/${complaintId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.ok) {
        setComplaints((prevComplaints) =>
          prevComplaints.map((comp) =>
            comp.id === complaintId
              ? {
                  ...comp,
                  complaintDetails: {
                    ...comp.complaintDetails,
                    upvotes: data.upvotes,
                  },
                }
              : comp
          )
        );

        setUpvotedComplaints((prevUpvoted) => {
          if (data.hasUpvoted) {
            return [...prevUpvoted, complaintId];
          } else {
            return prevUpvoted.filter((id) => id !== complaintId);
          }
        });
      } else {
        console.error("Failed to toggle upvote:", data.error);
      }
    } catch (error) {
      console.error("Failed to upvote the complaint:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar/>
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
                <ScrollToTop smooth component={<FaChevronUp />} className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"/>
                <div className="flex flex-col gap-4">
                  {complaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      showProfile={true}
                      showUpvote={true}
                      handleUpvote={handleUpvote}
                      upvotedComplaints={upvotedComplaints}
                      showActions={false}
                      showBadges={false}
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
