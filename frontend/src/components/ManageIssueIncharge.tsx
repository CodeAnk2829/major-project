import {
  Alert,
  Button,
  Modal,
  Select,
  Spinner,
  Table,
  TextInput,
  Toast,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineNotification } from "react-icons/ai";

function ManageIssueIncharge() {
  const [incharges, setIncharges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIncharge, setNewIncharge] = useState({ role: "ISSUE_INCHARGE" });
  const [locations, setLocations] = useState([]);
  const [selectedIncharge, setSelectedIncharge] = useState(null);
  const [updatedIncharge, setUpdatedIncharge] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [inchargeToDelete, setInchargeToDelete] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const customThemeTi = {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      rightIcon: {
        base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "p-4 sm:text-base",
        },
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
        },
        withRightIcon: {
          on: "pr-10",
          off: "",
        },
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
      },
    },
  };
  const customThemeSelect = {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "p-4 sm:text-base",
        },
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
        },
      },
    },
  };
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  useEffect(() => {
    const fetchIncharges = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/get/incharges");
        const data = await res.json();
        if (data.ok) {
          setIncharges(data.incharges);
        }
      } catch (error) {
        showError("Cannot fetch incharges: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/admin/get/locations");
        const data = await res.json();
        if (data.ok) {
          setLocations(data.locations);
        } else {
          console.error("Failed to fetch locations: ", data.error);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncharges();
    fetchLocations();
  }, []);

  const handleAddIncharge = async () => {
    console.log(newIncharge);
    if (
      !newIncharge.name ||
      !newIncharge.phoneNumber ||
      !newIncharge.email ||
      !newIncharge.location ||
      !newIncharge.password ||
      !newIncharge.designation ||
      !newIncharge.rank
    ) {
      setAddError("All fields are mandatory");
    }

    if (newIncharge.name.length < 3) {
      setAddError("The name should be atleast 3 characters.");
    }

    if (newIncharge.password.length < 6) {
      setAddError("Passwords must be atleast 6 characters.");
    }

    if (newIncharge.designation.length < 3) {
      setAddError("Designation must be atleast 3 characters.");
    }

    if (newIncharge.location.length < 3) {
      setAddError("Location must be atleast 3 characters. Invalid Location");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/assign/incharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncharge),
      });
      const data = await res.json();
      if (data.ok) {
        setToastMessage("Incharge added successfully!");
        setIncharges((prev) => [...prev, { ...data }]);
        setNewIncharge({role:"ISSUE_INCHARGE"});
        setShowAddModal(false);
      } else {
        setToastMessage(data.error || "Failed to add incharge.");
      }
    } catch (err) {
      console.error("Failed to add incharge:", err);
      setToastMessage("An error occurred.");
      setAddError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInchargeDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/get/incharge/${id}`);
      const data = await res.json();
      const { ok, ...inchargeDetails } = data;
      if (data.ok) {
        setSelectedIncharge(inchargeDetails);
        setUpdatedIncharge(inchargeDetails);
      }
    } catch (error) {
      console.error("Failed to fetch incharge details: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncharge = async () => {
    if (!inchargeToDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/remove/user/${inchargeToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setIncharges(
          incharges.filter((inc) => inc.inchargeId !== inchargeToDelete)
        );
        setToastMessage("User deleted successfully!");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      setToastMessage("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncharge = async () => {
    console.log(updatedIncharge);
    setLoading(true);
    try {
      const { inchargeId, createdAt, ...dataToSend } = updatedIncharge;
      const res = await fetch(
        `/api/v1/admin/update/incharge/${updatedIncharge.inchargeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setToastMessage("Incharge updated successfully!");
        setIncharges(
          incharges.map((inc) =>
            inc.inchargeId === updatedIncharge.inchargeId
              ? { ...inc, ...updatedIncharge }
              : inc
          )
        );

        setShowUpdateModal(false);
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Failed to update incharge:", err);
      setToastMessage("Failed to update incharge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Add Button */}
      <Button
        gradientDuoTone="purpleToBlue"
        onClick={() => setShowAddModal(true)}
        className="mb-4"
      >
        Add New Issue Incharge
      </Button>
      {loading && (
        <div className="flex justify-center items-center h-full">
          <Spinner size="xl" className="fill-[rgb(60,79,131)]" />
        </div>
      )}

      {toastMessage && (
        <div className="absolute top-5 left-1/2">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500">
              <AiOutlineNotification className="h-5 w-5" />
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

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Location</Table.HeadCell>
          <Table.HeadCell>Designation</Table.HeadCell>
          <Table.HeadCell>Rank</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>

        <Table.Body>
          {incharges.map((incharge) => (
            <Table.Row key={incharge.inchargeId}>
              <Table.Cell>
                <Button
                  color="link"
                  onClick={() => {
                    fetchInchargeDetails(incharge.inchargeId);
                    setShowDetailsModal(true);
                  }}
                >
                  {incharge.name}
                </Button>
              </Table.Cell>
              <Table.Cell>{incharge.email}</Table.Cell>
              <Table.Cell>{incharge.phoneNumber}</Table.Cell>
              <Table.Cell>{incharge.location}</Table.Cell>
              <Table.Cell>{incharge.designation}</Table.Cell>
              <Table.Cell>{incharge.rank}</Table.Cell>
              <Table.Cell className="flex flex-row gap-4">
                <Button
                  color="warning"
                  onClick={() => {
                    fetchInchargeDetails(incharge.inchargeId);
                    setShowUpdateModal(true);
                  }}
                >
                  Update
                </Button>
                <Button
                  color="failure"
                   onClick={() => {
                    setInchargeToDelete(incharge.inchargeId);
                    setShowDeleteModal(true);
                   }}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Add Incharge Modal */}
      <Modal
        show={showAddModal}
        onClose={() => {
          setNewIncharge({ role: "ISSUE_INCHARGE" });
          setShowAddModal(false);
        }}
        size="5xl"
      >
        <Modal.Header>Add New Incharge</Modal.Header>
        <Modal.Body className="flex flex-col gap-2">
          <TextInput
            placeholder="Name"
            value={newIncharge.name || ""}
            onChange={(e) =>
              setNewIncharge({ ...newIncharge, name: e.target.value })
            }
            theme={customThemeTi}
          />
          <TextInput
            placeholder="Email"
            value={newIncharge.email || ""}
            onChange={(e) =>
              setNewIncharge({ ...newIncharge, email: e.target.value })
            }
            theme={customThemeTi}
          />
          <TextInput
            placeholder="Phone Number"
            value={newIncharge.phoneNumber || ""}
            onChange={(e) =>
              setNewIncharge({ ...newIncharge, phoneNumber: e.target.value })
            }
            theme={customThemeTi}
          />

          <TextInput
            placeholder="Password"
            type="password"
            value={newIncharge.password || ""}
            onChange={(e) =>
              setNewIncharge({ ...newIncharge, password: e.target.value })
            }
            theme={customThemeTi}
          />

          <Select
            theme={customThemeSelect}
            onChange={(e) =>
              setNewIncharge({
                ...newIncharge,
                location: e.target.value,
              })
            }
            defaultValue=""
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((loc) => (
              <option
                key={loc.id}
                value={`${loc.location}${
                  loc.locationName ? `-${loc.locationName}` : ""
                }${loc.locationBlock ? `-${loc.locationBlock}` : ""}`}
              >
                {loc.location}
                {loc.locationName ? `-${loc.locationName}` : ""}
                {""}
                {loc.locationBlock ? `-${loc.locationBlock}` : ""}
              </option>
            ))}
          </Select>

          <TextInput
            placeholder="Designation"
            value={newIncharge.designation || ""}
            onChange={(e) =>
              setNewIncharge({ ...newIncharge, designation: e.target.value })
            }
            theme={customThemeTi}
          />
          <TextInput
            placeholder="Rank"
            type="number"
            value={newIncharge.rank || ""}
            onChange={(e) =>
              setNewIncharge({
                ...newIncharge,
                rank: parseInt(e.target.value, 10),
              })
            }
            theme={customThemeTi}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleAddIncharge}
            className="bg-[rgb(60,79,131)] hover:bg-[rgb(60,79,151)]"
          >
            Add
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setNewIncharge({ role: "ISSUE_INCHARGE" });
              setShowAddModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
        {addError && <Alert color="failure">{addError}</Alert>}
      </Modal>

      {/* Show Details Modal */}
      <Modal show={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <Modal.Header>Incharge Details</Modal.Header>
        <Modal.Body>
          {selectedIncharge && (
            <div>
              <p>
                <strong>Name:</strong> {selectedIncharge.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedIncharge.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedIncharge.phoneNumber}
              </p>
              <p>
                <strong>Location:</strong> {selectedIncharge.location}
              </p>
              <p>
                <strong>Designation:</strong> {selectedIncharge.designation}
              </p>
              <p>
                <strong>Rank:</strong> {selectedIncharge.rank}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedIncharge.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="warning"
            onClick={() => {
              setShowDetailsModal(false);
              setShowUpdateModal(true); // Open the update modal from here
            }}
          >
            Update
          </Button>
          <Button color="gray" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Details Modal */}
      <Modal
        show={showUpdateModal}
        size="3xl"
        onClose={() => setShowUpdateModal(false)}
      >
        <Modal.Header>Update Incharge Details</Modal.Header>
        <Modal.Body className="flex flex-col gap-3">
          <TextInput
            placeholder="Name"
            value={updatedIncharge?.name || ""}
            onChange={(e) =>
              setUpdatedIncharge({ ...updatedIncharge, name: e.target.value })
            }
          />
          <TextInput
            placeholder="Email"
            value={updatedIncharge?.email || ""}
            onChange={(e) =>
              setUpdatedIncharge({
                ...updatedIncharge,
                email: e.target.value,
              })
            }
          />
          <TextInput
            placeholder="Phone Number"
            value={updatedIncharge?.phoneNumber || ""}
            onChange={(e) =>
              setUpdatedIncharge({
                ...updatedIncharge,
                phoneNumber: e.target.value,
              })
            }
          />
          <Select
            theme={customThemeSelect}
            onChange={(e) =>
              setUpdatedIncharge({
                ...updatedIncharge,
                location: e.target.value,
              })
            }
            value={updatedIncharge?.location || ""}
            defaultValue=""
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations &&
              locations.length > 0 &&
              locations.map((loc) => (
                <option
                  key={loc.id}
                  value={`${loc.location}${
                    loc.locationName ? `-${loc.locationName}` : ""
                  }${loc.locationBlock ? `-${loc.locationBlock}` : ""}`}
                >
                  {loc.location}
                  {loc.locationName ? `-${loc.locationName}` : ""}
                  {""}
                  {loc.locationBlock ? `-${loc.locationBlock}` : ""}
                </option>
              ))}
          </Select>
          <TextInput
            placeholder="Designation"
            value={updatedIncharge?.designation || ""}
            onChange={(e) =>
              setUpdatedIncharge({
                ...updatedIncharge,
                designation: e.target.value,
              })
            }
          />
          <TextInput
            placeholder="Rank"
            type="number"
            value={updatedIncharge?.rank || ""}
            onChange={(e) =>
              setUpdatedIncharge({
                ...updatedIncharge,
                rank: parseInt(e.target.value, 10),
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateIncharge}>Save</Button>
          <Button color="gray" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* TODO Delete Issue Incharge Modal */} 
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the issue incharge? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => {
              handleDeleteIncharge();
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
          <Button color="gray" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageIssueIncharge;
