import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Alert, Button, Modal, Table, TextInput, Toast } from 'flowbite-react';
import { GrCircleAlert } from 'react-icons/gr';
import { HiCheck } from 'react-icons/hi';

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState({location:"", locationName:"", locationBlock:""});
  const [toastMessage, setToastMessage] = useState<string|null>(null);
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
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000); // Disappear after 3 seconds
  };
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/v1/admin/get/locations");
        if (!res.ok) {
          showError("Failed to fetch locations");
        }
        const data = await res.json();
        setLocations(data.locations);
      } catch (error) {
        showError("An error occurred while fetching tags. ");
      }
    };
    fetchTags();
  }, []);

  const handleAddLocation = async()=>{
    if (!newLocation.location.trim()) {
      showError("Location field is required.");
      return;
    }

    const isDuplicate = locations.some(
      (loc) =>
        loc.location.toLowerCase() === newLocation.location.trim().toLowerCase() &&
        loc.locationName?.toLowerCase() === newLocation.locationName.trim().toLowerCase() &&
        loc.locationBlock?.toLowerCase() === newLocation.locationBlock.trim().toLowerCase()
    );
    if (isDuplicate) {
      showError("This location already exists.")
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/create/locations',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({locations: [newLocation]})
      });
      const data = await res.json();
      if(data.ok){
        setLocations([...locations, {...newLocation}]);
        setNewLocation({ location: "", locationName: "", locationBlock: "" });
        setToastMessage("Location added successfully!");
      }else{
        setError(data.error);
      }
    } catch (error) {
      showError("An error occurred while adding location.");
    }finally{
      setLoading(false);
    }
  }

  const handleDeleteLocation = async()=>{
    if (locationToDelete === null) return;
    setLoading(true);

    try {
      const res = await fetch('/api/v1/admin/remove/locations',{
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({locations: [locationToDelete]})
      })
      const data = await res.json();
      if(data.ok){
        setLocations(locations.filter((loc)=> loc !== locationToDelete));
        setToastMessage("Location delete successfully!");
      }else{
        showError(data.error);
      }
    } catch (error) {
      showError("An error occurred while deleting the location.");
    }finally{
      setLoading(false);
      setShowModal(false);
      setLocationToDelete(null);
    }
  }
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <AdminSidebar />
      </div>

      {/* Main Section */}
      <div className="w-full md:w-3/4 flex flex-col px-6 py-4">
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
                onClick={() => setToastMessage(null)}
              >
                ✖️
              </button>
            </Toast>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert color="failure" icon={GrCircleAlert}>
            <span className="font-medium">{error}</span>
          </Alert>
        )}

        {/* Spinner
        {loading && (
          <div className="flex justify-center items-center mb-4">
            <Spinner size="lg" aria-label="Loading..." />
          </div>
        )} */}

        {/* Main Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Locations</h1>
          <div className="mb-6 flex gap-4 items-center">
            <TextInput
              id="location"
              placeholder="Enter location"
              value={newLocation.location}
              theme={customThemeTi}
              onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
            />
            <TextInput
              id="locationName"
              placeholder="Enter location name (optional)"
              value={newLocation.locationName}
              theme={customThemeTi}
              onChange={(e) => setNewLocation({ ...newLocation, locationName: e.target.value })}
            />
            <TextInput
              id="locationBlock"
              placeholder="Enter location block (optional)"
              value={newLocation.locationBlock}
              theme={customThemeTi}
              onChange={(e) => setNewLocation({ ...newLocation, locationBlock: e.target.value })}
            />
            <Button
              onClick={handleAddLocation}
              disabled={loading || !newLocation.location.trim()}
              gradientDuoTone="purpleToBlue"
            >
              Add Location
            </Button>
          </div>
          <Table hoverable className="w-full">
            <Table.Head>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell>Location Name</Table.HeadCell>
              <Table.HeadCell>Location Block</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {locations.map((loc) => (
                <Table.Row key={loc.id}>
                  <Table.Cell>{loc.location}</Table.Cell>
                  <Table.Cell>{loc.locationName || "-"}</Table.Cell>
                  <Table.Cell>{loc.locationBlock || "-"}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="failure"
                      onClick={() => {
                        setLocationToDelete(loc);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this location?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="failure" onClick={handleDeleteLocation}>
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

export default ManageLocations
