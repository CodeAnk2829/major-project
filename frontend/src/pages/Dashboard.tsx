import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { Badge, Button, Modal, Spinner, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import UpdateComplaintModal from "../components/UpdateComplaintModal";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [userComplaints, setUserComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [complaintIdToDelete, setComplaintIdToDelete] = useState('');
  const [error, setError] = useState(null);
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState('');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const statusColors: Record<string, string> = {
    PENDING: "warning",
    ASSIGNED: "indigo",
    RESOLVED: "success",
    NOT_RESOLVED: "failure",
  };

  useEffect(() => {
    const fetchUserComplaints = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/v1/complaint/user/${currentUser.id}`
        );
        const data = await response.json();
        if (!data.ok) {
          throw new Error(data.error || "Failed to fetch complaints.");
        }
        setUserComplaints(data.complaints);
        console.log(userComplaints);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [currentUser.id]);

  const handleDeleteComplaint = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/v1/complaint/delete/${complaintIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserComplaints((prev) =>
          prev.filter((complaint) => complaint.id !== complaintIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SideBar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" className="fill-[rgb(60,79,131)]" />
          </div>
        ) : (
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Posted Anonymously?</Table.HeadCell>
                <Table.HeadCell>Access</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {userComplaints.map((complaint: any) => (
                  <Table.Row key={complaint.id}>
                    <Table.Cell>
                      <Link
                        to={`/complaint/${complaint.id}`}
                        className="text-slate-900 hover:underline"
                      >
                        {complaint.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={statusColors[complaint.status]}>
                        {complaint.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="">
                      {complaint.postAsAnonymous ? <TiTick color="#4bb543" size={30}/> : <ImCross color="#fc100d" size={18}/>}
                    </Table.Cell>
                    <Table.Cell>{complaint.access}</Table.Cell>
                    <Table.Cell className="flex gap-3">
                      <Button
                        color="info"
                        size="xs"
                        onClick={() => {
                          setUpdateModalOpen(true);
                          setComplaintIdToUpdate(complaint.id);
                        }}
                        disabled={complaint.status !== "PENDING"}
                        className=""
                      >
                        <AiOutlineEdit className="mr-1" />
                        Update
                      </Button>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => {
                          setShowModal(true);
                          setComplaintIdToDelete(complaint.id);
                        }}
                        disabled={complaint.status !== "PENDING"}
                      >
                        <AiOutlineDelete className="mr-1" />
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this complaint?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComplaint}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <UpdateComplaintModal isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)} 
        complaintIdProp={complaintIdToUpdate}/>
    </div>
  );
}

export default Dashboard;
