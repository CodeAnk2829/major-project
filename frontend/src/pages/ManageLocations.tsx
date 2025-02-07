import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Alert, Button, Modal, Spinner, Table, TextInput, Toast } from 'flowbite-react';
import { GrCircleAlert } from 'react-icons/gr';
import { HiCheck } from 'react-icons/hi';
import { customThemeTi } from '../utils/flowbiteCustomThemes';

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState({location:"", locationName:"", locationBlock:""});
  const [toastMessage, setToastMessage] = useState<string|null>(null);
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000); // Disappear after 3 seconds
  };
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/admin/get/locations");
        if (!res.ok) {
          showError("Failed to fetch locations");
        }
        const data = await res.json();
        setLocations(data.locations);
      } catch (error) {
        showError("An error occurred while fetching tags. ");
      } finally{
        setLoading(false);
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
      console.log(data);
      if(data.ok){
        setLocations(locations.filter((loc)=> loc !== locationToDelete));
        setToastMessage("Location deleted successfully!");
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

        {loading && (
          <div className="flex justify-center items-center mb-4">
            <Spinner size="xl" aria-label="Loading..." />
          </div>
        )}

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
              {locations && locations.length > 0 && locations.map((loc) => (
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
