import { Badge, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/styles.css";
import statusColors from "../utils/statusColors";

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
  handleUpvote?: (id: string) => void;
  upvotedComplaints: string[];
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
  handleUpvote,
  upvotedComplaints,
  onUpdate,
  onDelete,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isUpvoted = showUpvote && upvotedComplaints.includes(complaint.id);

  // Prepare images for the Lightbox
  const slides = complaint.attachments.map((attachment) => ({
    src: attachment.imageUrl,
  }));

  const createdAtDisplay =
    moment().diff(moment(complaint.createdAt), "days") > 5
      ? moment(complaint.createdAt).format("DD/MM/YYYY")
      : moment(complaint.createdAt).fromNow();

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
      {complaint.attachments.length > 0 && (
        <div className="relative flex flex-col justify-center items-center mt-4">
          <Lightbox
            styles={{
              container: { backgroundColor: "rgba(255,255,255)" },
              root: {
                "--yarl__color_button": "rgb(66,66,66)",
                "--yarl__color_button_active": "rgb(158, 158, 158)",
              },
            }}
            index={lightboxIndex}
            slides={slides}
            plugins={[Inline]}
            on={{
              view: ({ index }) => setLightboxIndex(index),
              click: () => setLightboxOpen(true),
            }}
            carousel={{
              padding: 0,
              spacing: 0,
              imageFit: "cover", // Ensures the image fills the container
            }}
            inline={{
              style: {
                width: "100%",
                height: "300px",
                maxWidth: "900px",
                // margin: "0 auto",
                cursor: "pointer",
                // borderRadius: "8px",
                // display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // color: "transparent",
              },
            }}
          />

          {/* Lightbox (Full-Screen View) */}
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
            on={{
              view: ({ index }) => setLightboxIndex(index),
            }}
            animation={{ fade: 0 }}
            controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
            styles={{
              container: { backgroundColor: "rgba(0,0,0,0.9)" },
              root: {
                "--yarl__color_button": "rgb(66,66,66)",
                "--yarl__color_button_active": "rgb(158, 158, 158)",
              },
            }}
          />
        </div>
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
        {showBadges && (
          <div className="flex mt-2">
            <Badge
              color={complaint.access === "PUBLIC" ? "success" : "warning"}
            >
              {complaint.access}
            </Badge>
            {complaint.postAsAnonymous && (
              <Badge color="gray" className="ml-2">
                Anonymous
              </Badge>
            )}
          </div>
        )}
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
                isUpvoted ? "text-blue-800" : "text-gray-600"
              } hover:text-blue-800`}
              onClick={() => {
                handleUpvote(complaint.id);
              }}
            >
              {isUpvoted ? <BiSolidUpvote /> : <BiUpvote />}
            </button>
            <span className="ml-2 text-gray-600 text-sm">
              {complaint.complaintDetails.upvotes} upvotes
            </span>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              color="light"
              disabled={complaint.status !== "PENDING"}
              onClick={() => onUpdate?.(complaint.id)}
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
