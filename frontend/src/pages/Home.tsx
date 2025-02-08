import React, { useCallback, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ComplaintCard from "../components/ComplaintCard";
import { Pagination, Spinner } from "flowbite-react";
import SideBar from "../components/SideBar";
import ScrollToTop from "react-scroll-to-top";
import { FaChevronUp } from "react-icons/fa";
import { customThemePagination } from "../utils/flowbiteCustomThemes";
interface Complaint {
  id: string;
  complaintDetails: {
    upvotes: number;
  };
}
const Home = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotedComplaints, setUpvotedComplaints] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage, setComplaintsPerPage] = useState(10);
  const onPageChange = (page: number) => setCurrentPage(page);
  const lastComplaintIndex = currentPage * complaintsPerPage;
  const firstComplaintIndex = lastComplaintIndex - complaintsPerPage;
  const currentComplaints = complaints.slice(
    firstComplaintIndex,
    lastComplaintIndex
  );

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true); // Start the loading state
      try {
        const res = await fetch("/api/v1/complaint/get/all-complaints");
        if (!res.ok) {
          throw new Error(
            "Failed to fetch complaints. Please try again later."
          );
        }
        const data = await res.json();
        if (!data.complaintDetails) {
          throw new Error("Unexpected response format.");
        }
        setComplaints(data.complaintDetails);
        setUpvotedComplaints(data.upvotedComplaints.map((c: any) => String(c)));
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
    try {
      const res = await fetch(`/api/v1/complaint/upvote/${complaintId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.ok) {
        console.error("Failed to toggle upvote:", data.error);
        return;
      }

      setComplaints((prevComplaints) => {
        const newComplaints = prevComplaints.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                upvotes: data.upvotes,
              }
            : complaint
        );
        return [...newComplaints]; // Ensure a fresh array
      });

      setUpvotedComplaints((prevUpvoted) => {
        return data.hasUpvoted
          ? [...new Set([...prevUpvoted, complaintId])]
          : prevUpvoted.filter((id) => id !== complaintId);
      });
    } catch (error) {
      console.error("Failed to upvote the complaint:", error);
    }
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                <ScrollToTop
                  smooth
                  component={<FaChevronUp />}
                  className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                />
                <div className="flex flex-col gap-4">
                  
                  {currentComplaints.map((complaint) => (
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
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(complaints.length / complaintsPerPage)}
          onPageChange={onPageChange}
          className="mt-5 self-center"
          showIcons
          theme={customThemePagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;
