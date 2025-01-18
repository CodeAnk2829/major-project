import { Badge, Button, Carousel, Modal, Spinner, Tooltip } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import UpdateComplaintModal from "../components/UpdateComplaintModal";

function ComplaintPage() {
  const id = useLocation().pathname.split("/")[2];
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useSelector((state: any) => state.user);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [hasUserUpvoted, setHasUserUpvoted] = useState(false);
  const navigate = useNavigate();
  const statusColors: Record<string, string> = {
    PENDING: "warning",
    ASSIGNED: "indigo",
    RESOLVED: "success",
    NOT_RESOLVED: "failure",
  };
  const customThemeCarousel = {
    indicators: {
      active: {
        off: "bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
        on: "bg-white dark:bg-gray-800",
      },
      base: "h-3 w-3 rounded-full",
      wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
    },
    control: {
      base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
      icon: "h-5 w-5 text-slate-700 dark:text-gray-800 sm:h-6 sm:w-6",
    },
    scrollContainer: {
      base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg",
      snap: "snap-x",
    },
  };
  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/complaint/get-complaint/${id}`);
        const data = await response.json();
        console.log(data);
        setComplaint(data);
        setHasUserUpvoted(data.hasUpvoted);
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError("Failed to load complaint. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" className="fill-[rgb(60,79,131)]"/>
      </div>
    );
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    const handleUpvote = async () => {
      try {
        const res = await fetch(`/api/v1/complaint/upvote/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
  
        if (data.ok) {
          // Update the complaint with new upvote count and status
          setComplaint(prev => ({
            ...prev,
            upvotes: data.upvotes
          }));
          setHasUserUpvoted(data.hasUpvoted);
        } else {
          console.error("Failed to toggle upvote:", data.error);
        }
      } catch (error) {
        console.error("Failed to upvote the complaint:", error);
      }
    };

  const handleUpdate = async () => {
    console.log("complaint update clicked");
    setUpdateModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteModal(false);
    try {
      const res = await fetch(`/api/v1/complaint/delete/${id}`,{
        method : 'DELETE'
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.error);
      }else{
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const createdAtDisplay =
    moment().diff(moment(complaint.createdAt), "days") > 5
      ? moment(complaint.createdAt).format("DD/MM/YYYY")
      : moment(complaint.createdAt).fromNow();
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {complaint && complaint.title}
      </h1>
      <div className="mt-4 flex flex-wrap gap-2 self-center mt-5">
        {complaint && complaint.tags.length >0 && complaint.tags.map((tag: string, index: number) => (
          <Badge key={index} color="info">
            {tag.tags.tagName}
          </Badge>
        ))}
      </div>
      <div className="mt-4 flex gap-4 self-center">
        <Badge color={statusColors[complaint.status]}>{complaint.status}</Badge>
      </div>
      {complaint.attachments.length > 0 ? (
          <Carousel
            slide={false}
            className="mt-4 h-96"
            theme={customThemeCarousel}
          >
            {complaint.attachments.map((attachment) => (
              <img
                key={attachment.id}
                src={attachment.imageUrl}
                alt="Complaint Attachment"
                className="object-scale-down"
              />
            ))}
          </Carousel>
        ) : (
          <Carousel slide={false} className="mt-4 h-96" theme={customThemeCarousel}>
          <img src='/default-complaint.jpg' alt='default complaint' className="object-scale-down"/>
        </Carousel>
        )}
      <div className="mt-4 flex gap-4 self-center border-b border-slate-500">
        <p>
          <strong>Created by:</strong> {complaint &&complaint.userName}
        </p>
        <p>
          <strong>Created:</strong> {complaint && createdAtDisplay}
        </p>
        <p>
          {/* <strong>Location:</strong> Location */}
        </p>
        <p className="flex">
        <button
            className={`text-xl ${
              hasUserUpvoted ? "text-blue-800" : "text-gray-600"
            } hover:text-blue-800`}
            onClick={handleUpvote}
          >
            {hasUserUpvoted ? <BiSolidUpvote /> : <BiUpvote />}
          </button>
          <span className="ml-2 text-gray-600 text-sm">
            {complaint && complaint.upvotes} upvotes
          </span>
        </p>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full"
        dangerouslySetInnerHTML={{ __html: complaint && complaint.description }}
      ></div>
      {currentUser.id === complaint.userId && (
        <div className="mt-8 flex gap-4 self-center">
          <Tooltip
            content={
              complaint.status !== "PENDING"
                ? "Complaint is assigned and cannot be updated"
                : "edit complaint details"
            }
            arrow={false}
            trigger="hover"
          >
            <Button
              color="light"
              onClick={handleUpdate}
              disabled={complaint.status !== "PENDING"}
            >
              <AiOutlineEdit className="mr-2" />
              Update
            </Button>
          </Tooltip>
          <Button color="failure" onClick={() => setDeleteModal(true)}>
            <AiOutlineDelete className="mr-2" />
            Delete
          </Button>
        </div>
      )}
      <Modal show={deleteModal} onClose={() => setDeleteModal(false)} size="lg">
        <Modal.Header>Delete Complaint</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this complaint?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="gray" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <UpdateComplaintModal isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)} 
        complaintIdProp={id}/>
    </main>
  );
}

export default ComplaintPage;
