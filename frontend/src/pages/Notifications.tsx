import React, { useCallback, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import EmojiRating from "../components/EmojiRating";
import { useSelector } from "react-redux";
import { Badge, Button, Label, Modal, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import statusColors from "../utils/statusColors";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [feedback, setFeedback] = useState({});

  //TODO: fetch notifications
  // const fetchNotifications = useCallback(() => {
  //   fetch(`/api/v1/notifications/${currentUser._id}`)
  //     .then((res) => res.json())
  //     .then((data) => setNotifications(data));
  // }, [currentUser._id]);

  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  //TODO: add websocket
  // useComplaintWebSocket((data) => {
  //   if (data.type === "notification") {
  //     setNotifications((prev) => [data.notification, ...prev]);
  //   }
  // });

  //TODO: Complete this function
  const handleFeedback = () => {
    // setSelectedComplaintId(complaintId);
    setIsFeedbackModalOpen(true);
  };

  //TODO: Complete this function based on the backend
  const submitFeedback = (feedbackValue) => {
    console.log("Submit feedback");
    // fetch(`/api/v1/complaints/${selectedComplaintId}/feedback`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ feedback: feedbackValue }),
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setIsFeedbackModalOpen(false);
    //     setNotifications((prev) =>
    //       prev.map((notif) =>
    //         notif.complaintId === selectedComplaintId
    //           ? { ...notif, feedbackSubmitted: true }
    //           : notif
    //       )
    //     );
    //   });
  };

  const handleModalClose = () => {
    setIsFeedbackModalOpen(false);
    setSelectedComplaintId(null);
    setFeedback(null);// Reset the feedback
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <ul>
          {/* TODO: Map the notifications */}
          {/* {notifications && notifications.length > 0 && notifications.map((notif) => ( */}
          <li
            // key={notif._id}
            className="bg-white shadow-md p-4 rounded-lg mb-3 flex justify-between items-center"
          >
            <div>
              <Link
                to={`/complaint/`}
                className="text-lg font-semibold text-gray-800 hover:text-[rgb(60,79,131)]"
              >
                Complaint title with link to complaint page
              </Link>
              <p className="text-sm text-gray-500">
                Complaint description in short with a see more button{" "}
              </p>
              <Badge
                className="text-xs font-semibold px-3 py-1 w-1/2"
                color={statusColors["RESOLVED"] || "gray"}
              >
                Complaint status change
              </Badge>
              <p className="text-sm text-gray-500">when was status changed</p>
              <p className="text-sm text-gray-500">which incharge/resolver changed the status</p>
            </div>
            {/* {notif.status === "resolved" && !notif.feedbackSubmitted && ( */}
            <Button onClick={() => handleFeedback()} gradientDuoTone="purpleToBlue">Give Feedback</Button>
            {/* )} */}
          </li>
          {/* ))} */}
        </ul>
        {/* Feedback Modal */}
        <Modal
          show={isFeedbackModalOpen}
          onClose={() => handleModalClose()}
          size="3xl"
        >
          <Modal.Header>Submit Feedback</Modal.Header>
          <Modal.Body>
            <Label>Feedback:</Label>
            <Textarea placeholder="Write your feedback here" rows={5}/>
            <EmojiRating onRate={submitFeedback} />
            <div className="flex gap-5 mt-5 justify-between">
            <Button gradientDuoTone="purpleToBlue" outline>Submit Feedback & Close Complaint</Button>
            <Button gradientDuoTone="greenToBlue" outline>Reraise complaint</Button>
            <Button color="light" onClick={handleModalClose}>Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Notifications;
