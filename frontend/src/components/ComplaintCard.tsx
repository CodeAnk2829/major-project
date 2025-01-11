import React from "react";
import { Link } from "react-router-dom";

interface Complaint {
  id: string;
  title: string;
  description: string;
  access: string;
  userId: string;
  location: string;
  createdAt: string;
  status: string;
  attachments: string[]; // Add attachments to include images
}

interface ComplaintCardProps {
  complaint: Complaint;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  // Define color for each status
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-200 text-yellow-700",
    ASSIGNED: "bg-blue-200 text-blue-700",
    RESOLVED: "bg-green-200 text-green-700",
    NOT_RESOLVED: "bg-red-200 text-red-700",
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col sm:flex-row gap-6">
      <div className="flex flex-col flex-1">
        <Link
          to={`/complaint/${complaint.id}`}
          className="text-lg font-semibold text-gray-800"
        >
          {complaint.title}
        </Link>
        <p className="text-sm text-gray-600 mt-2">{complaint.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              statusColors[complaint.status] || "bg-gray-200 text-gray-700"
            }`}
          >
            {complaint.status}
          </span>
          <span className="text-sm text-gray-500">
            Location: Hostel-12-C
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            Created: {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">
            Access: {complaint.access}
          </span>
        </div>
      </div>
      {complaint.attachments && complaint.attachments.length > 0 ? (
        <img
          src={complaint.attachments[0]} // Display the first image
          alt="Complaint Attachment"
          className="w-56 object-cover rounded"
        />
      ) : (
        <img
          src='/default-complaint.jpg' // Display the first image
          alt="Complaint Attachment"
          className="w-56 object-cover rounded"
        />
      )}
    </div>
  );
};

export default ComplaintCard;
