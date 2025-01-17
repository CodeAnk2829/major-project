import { Badge, Button, Carousel } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";

interface Attachment {
  id: string;
  imageUrl: string;
}

interface ComplaintDetails {
  actionTaken: boolean;
  upvotes: number;
}

interface User {
  userId: string;
  name: string;
}

interface Tags {
  tagName: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  access: string;
  userId: string;
  user: User;
  createdAt: string;
  status: string;
  attachments: Attachment[];
  complaintDetails: ComplaintDetails;
  postAsAnonymous: boolean;
  tags: Tags[];
}

interface ComplaintCardProps {
  complaint: Complaint;
  showProfile: boolean;
  showUpvote: boolean;
  showActions: boolean;
  showBadges: boolean;
  onUpdate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getInitials = (name: string): string => {
  const nameParts = name.trim().split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0]
      : nameParts[0][0] + nameParts[nameParts.length - 1][0];
  return initials.toUpperCase();
};

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  showProfile,
  showUpvote,
  showActions,
  showBadges,
  onUpdate,
  onDelete,
}) => {
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likes, setLikes] = useState(complaint.complaintDetails.upvotes);
  const statusColors: Record<string, string> = {
    PENDING: "warning",
    ASSIGNED: "indigo",
    RESOLVED: "success",
    NOT_RESOLVED: "failure",
  };

  const handleToggleUpvote = async () => {
    setHasUserLiked((hasUserLiked) => !hasUserLiked);
    handleUpvote();
    setLikes((likes) => (hasUserLiked ? likes - 1 : likes + 1));
  };

  //TODO : handleUpvote - check for hasUserLiked from response
  const handleUpvote = async () => {
    console.log("Upvote clicked");
    // try {
    //   const res = await fetch(`/api/v1/complaint/upvote/${id}`, {
    //     method: hasUpvoted ? "POST" : "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //   });
    //   const data = await res.json();

    //   if (!res.ok) {
    //     throw new Error(data.error || "Failed to update upvote.");
    //   }

    //   // Update local complaint data
    //   setComplaints((prevComplaints) =>
    //     prevComplaints.map((complaint) =>
    //       complaint.id === id
    //         ? {
    //             ...complaint,
    //             upvotes: data.totalUpvotes || 0,
    //             hasUpvoted,
    //           }
    //         : complaint
    //     )
    //   );
    // } catch (error) {
    //   console.error("Error updating upvote:", error.message);
    // }
  };

  const createdAtDisplay =
    moment().diff(moment(complaint.createdAt), "days") > 5
      ? moment(complaint.createdAt).format("DD/MM/YYYY")
      : moment(complaint.createdAt).fromNow();

  const customThemeCarousel = {
    root: {
      base: "relative h-full w-full",
      leftControl:
        "absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
      rightControl:
        "absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
    },
    indicators: {
      active: {
        off: "bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
        on: "bg-white dark:bg-gray-800",
      },
      base: "h-3 w-3 rounded-full",
      wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
    },
    item: {
      base: "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2",
      wrapper: {
        off: "w-full flex-shrink-0 transform cursor-default snap-center",
        on: "w-full flex-shrink-0 transform cursor-grab snap-center",
      },
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
  return (
    <div className="border rounded-lg shadow-md bg-white flex flex-col">
      {/* Header */}
      {/* Profile Section */}
      {showProfile && (
        <div className="flex items-center border-b border-gray-200 p-4">
          <div className="w-12 h-12 bg-[rgb(60,79,131)] rounded-full flex items-center justify-center text-white font-bold text-lg">
            {getInitials(complaint.user.name || "User")}
          </div>
          <div className="ml-3">
            <span className="block text-sm font-bold text-gray-700">
              @{complaint.user.name}
            </span>
            <span className="text-xs text-gray-500">{createdAtDisplay}</span>
          </div>
        </div>
      )}

      {/* Image Carousel */}
      {complaint.attachments.length > 0 ? (
        <Carousel
          slide={false}
          className="mt-4 h-64"
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
        <Carousel slide={false} className="mt-4 h-64" theme={customThemeCarousel}>
          <img src='default-complaint.jpg' alt='default complaint' className="object-scale-down"/>
        </Carousel>
      )}

      {/* Complaint Details */}
      <div className="p-4">
        <Link
          to={`/complaint/${complaint.id}`}
          className="text-lg font-semibold text-gray-800 hover:text-[rgb(60,79,131)]"
        >
          {complaint.title}
        </Link>
        <p className="text-sm text-gray-600 mt-2">
          {complaint.description.length > 200 ? (
            <>
              {complaint.description.substring(0, 200)}...{" "}
              <Link to={`/complaint/${complaint.id}`} className="text-blue-500">
                read more
              </Link>
            </>
          ) : (
            complaint.description
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {complaint.tags.map((tag, index) => (
            <Badge key={index} color="info" className="text-sm font-medium">
              {tag.tags.tagName}
            </Badge>
          ))}
        </div>
        {showBadges && (<div className="flex mt-2">
          <Badge color={complaint.access === "PUBLIC" ? "success" : "warning"}>
            {complaint.access}
          </Badge>
          {complaint.postAsAnonymous && (
            <Badge color="gray" className="ml-2">
              Anonymous
            </Badge>
          )}
        </div>)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <Badge
          className="text-xs font-semibold px-3 py-1 rounded-full"
          color={statusColors[complaint.status] || "gray"}
        >
          {complaint.status}
        </Badge>

        {showUpvote && (
          <div className="flex items-center">
            <button
              className={`text-xl ${
                hasUserLiked ? "text-blue-600" : "text-gray-500"
              } hover:text-blue-800`}
              onClick={handleToggleUpvote}
            >
              {hasUserLiked ? <BiSolidUpvote /> : <BiUpvote />}
            </button>
            <span className="ml-2 text-gray-600 text-sm">{likes} upvotes</span>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              color="light"
              disabled={complaint.status !== "PENDING"}
              onClick={() => onUpdate && onUpdate(complaint.id)}
            >
              Update
            </Button>
            <Button
              color="failure"
              disabled={complaint.status !== "PENDING"}
              onClick={() => onDelete && onDelete(complaint.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
