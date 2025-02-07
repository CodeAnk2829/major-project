import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  Alert,
  Button,
  Modal,
  Spinner,
  Table,
  TextInput,
  Toast,
} from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { GrCircleAlert } from "react-icons/gr";
import { customThemeTi } from "../utils/flowbiteCustomThemes";

function ManageTags() {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000); // Disappear after 3 seconds
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/v1/admin/get/tags");
        if (!res.ok) {
          showError("Failed to fetch tags.");
        }
        const data = await res.json();
        setTags(data.tags);
        console.log(tags);
      } catch (error) {
        showError("An error occurred while fetching tags. ", error.message);
      }
    };
    fetchTags();
  }, []);

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      showError("Tag cannot be empty");
      return;
    }

    if (tags.some((tag) => tag.tagName.toLowerCase() === newTag.trim().toLowerCase())) {
      showError("Tag already exists.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/create/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: [newTag.trim()] }),
      });
      const data = await res.json();
      if (data.ok) {
        const updatedRes = await fetch("/api/v1/admin/get/tags");
        const updatedData = await updatedRes.json();
        if (updatedData.ok) {
          setTags(updatedData.tags); // Update state with the full tag list
          setNewTag("");
          setToastMessage("Tag added successfully!");
        }else{
          showError("Failed to add the tag");
        }
      }
    } catch (error) {
      showError("An error occured while creating a new tag. ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    setLoading(true); 
    try {
      const res = await fetch("/api/v1/admin/remove/tags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: [tagName] }), // Send tag name(s) as an array
      });
  
      const data = await res.json();
      console.log("ON tag delete: ", data);
      if (data.ok) {
        // Remove the deleted tag from the state
        setTags(tags.filter((tag) => tag.tagName !== tagName));
        setToastMessage("Tag deleted successfully!");
        setShowModal(false); 
      } else {
        showError(data.error || "Failed to delete the tag.");
      }
    } catch (err) {
      showError("An error occurred while deleting the tag.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <AdminSidebar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        {toastMessage && (
          <div className="absolute top-5 left-1/2">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
                aria-label="Close"
                onClick={() => setToastMessage(null)}
              >
                ✖️
              </button>
            </Toast>
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Tags</h1>
          {error && (
            <Alert color="failure" icon={GrCircleAlert}>
              <span className="font-medium">{error}</span>
            </Alert>
          )}
          <div className="mb-6 flex gap-4 items-center p-4">
            <TextInput
              id="new-tag"
              type="text"
              placeholder="Enter new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              theme={customThemeTi}
            />
            <Button
              onClick={handleAddTag}
              disabled={loading || !newTag.trim()}
              gradientDuoTone="purpleToBlue"
            >
              Add Tag
            </Button>
          </div>
          <div className="">
            <Table hoverable className="w-1/2">
              <Table.Head>
                <Table.HeadCell>Tag Name</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {tags &&
                  tags.length > 0 &&
                  tags.map((tag) => (
                    <Table.Row key={tag.id}>
                      <Table.Cell>{tag.tagName}</Table.Cell>
                      <Table.Cell>
                        <Button
                          color="failure"
                          onClick={() => {
                            setTagToDelete(tag.tagName);
                            setShowModal(true);
                          }}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        {/* Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete the tag{" "}
              <strong>{tagToDelete}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                if (tagToDelete) handleDeleteTag(tagToDelete);
              }}
              color="failure"
            >
              Delete
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ManageTags;