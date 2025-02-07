import React, { useEffect, useState } from "react";
import InchargeSidebar from "../components/InchargeSidebar";
import { Button, Card, Modal, Select, Spinner, TextInput, Toast } from "flowbite-react";
import IssueInchargeComplaintCard from "../components/IssueInchargeComplaintCard";
import ScrollToTop from "react-scroll-to-top";
import { FaChevronUp } from "react-icons/fa";
import { customThemeTi } from "../utils/flowbiteCustomThemes";

function InchargeManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [resolvers, setResolvers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [selectedResolver, setSelectedResolver] = useState<String | null>("");
  const [filteredResolvers, setFilteredResolvers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInchargeComplaints = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/incharge/get/all-complaints", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.ok) {
          setComplaints(data.complaints);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setToastMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInchargeComplaints();
    fetchResolvers();
  }, []);

  //TODO: May need to change this api call for fetching location/tag specific resolvers
  const fetchResolvers = async () => {
    try {
      const res = await fetch("/api/v1/incharge/get/resolvers", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.ok) {
        setResolvers(data.resolversDetails);
        setFilteredResolvers(data.resolversDetails);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setToastMessage(error.message);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await fetch("/api/v1/incharge/mark/resolved", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintId: id }),
      });
      const data = await res.json();
      if (data.ok) {
        setToastMessage("Complaint resolved successfully.");
        setComplaints((prev) =>
          prev.filter((complaint) => complaint.id !== id)
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setToastMessage(error.message);
    }
  };

  const handleDelegate = async (complaint) => {
    setSelectedComplaint(complaint);
    fetchResolvers();
    setDelegateModalOpen(true);
  };

  const handleEscalate = async (id) => {
    try {
      const res = await fetch("/api/v1/incharge/escalate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintId: id }),
      });
      const data = await res.json();
      if (data.ok) {
        setToastMessage("Complaint escalated successfully.");
        setComplaints((prev) =>
          prev.filter((complaint) => complaint.id !== id)
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setToastMessage(error.message);
    }
  };

  const handleConfirmDelegate = async () => {
    if (!selectedResolver) {
      setToastMessage("Please select a resolver to delegate.");
      return;
    }
    try {
      const res = await fetch("/api/v1/incharge/delegate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          resolverId: selectedResolver.id,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setToastMessage("Complaint delegated successfully.");
        setComplaints((prev) =>
          prev.filter((complaint) => complaint.id !== selectedComplaint.id)
        );
        setDelegateModalOpen(false);
        setSelectedResolver("");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setToastMessage(error.message);
    }
  };

  const handleCloseModal = () => {
    setDelegateModalOpen(false);
    setSelectedResolver(null);
    setSearchQuery("");
    setFilteredResolvers(resolvers);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();  // Convert the input to lowercase for case-insensitive search
    setSearchQuery(query);  // Update the searchQuery state
  
    // Filter resolvers by name or occupation matching the search query
    const filtered = resolvers.filter(resolver =>
      resolver.name.toLowerCase().includes(query) ||
      resolver.occupation.toLowerCase().includes(query)
    );
  
    setFilteredResolvers(filtered);  // Update the filteredResolvers state with the matching results
  };
  

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <InchargeSidebar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" className="fill-[rgb(60,79,131)]" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {complaints && complaints.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibold text-center">
                  Manage Complaints
                </h2>
                <ScrollToTop
                  smooth
                  component={<FaChevronUp />}
                  className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                />
                <div className="flex flex-col gap-4">
                  {complaints.map((complaint) => (
                    <IssueInchargeComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      showProfile={true}
                      showBadges={true}
                      onResolve={handleResolve}
                      onDelegate={handleDelegate}
                      onEscalate={handleEscalate}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No complaints found
              </div>
            )}
          </div>
        )}

        {toastMessage && (
          <div className="fixed top-4 right-4 z-50">
            <Toast className="bg-blue-500 text-white">
              {toastMessage}
              <Toast.Toggle onDismiss={() => setToastMessage(false)} />
            </Toast>
          </div>
        )}

        {/* Delegate Modal */}
        <Modal show={delegateModalOpen} onClose={handleCloseModal}>
          <Modal.Header>Delegate Complaint</Modal.Header>
          <Modal.Body>
          <TextInput
              type="text"
              placeholder="Search by name or occupation"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mb-4"
              theme={customThemeTi}
            />
            <div className="space-y-4">
              {filteredResolvers && filteredResolvers.length > 0 && filteredResolvers.map((resolver) => (
                <Card key={resolver.id} className={`cursor-pointer border ${(selectedResolver?.id === resolver.id) ? 'bg-sky-200' : 'border-gray-300'}`} onClick={() => setSelectedResolver(resolver)}>
                  <h5 className="text-lg font-semibold">{resolver.name}</h5>
                  <p className="text-sm text-gray-600">Occupation: {resolver.occupation}</p>
                  <p className="text-sm text-gray-600">Phone: {resolver.phoneNumber}</p>
                </Card>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleConfirmDelegate}
              gradientDuoTone="purpleToBlue"
              outline
            >
              Delegate
            </Button>
            <Button color="gray" onClick={handleCloseModal} className="hover: text-[rgb(61,79,131)]">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default InchargeManageComplaints;
