import axios from "axios";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  FileInput,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
  Toast,
  Tooltip,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { AiOutlineEdit } from "react-icons/ai";
import { HiExclamation } from "react-icons/hi";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

interface UpdateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintIdProp: string;
  onComplaintUpdate?: (updatedComplaint: any) => void;
}
const UpdateComplaintModal = ({
  isOpen,
  onClose,
  complaintIdProp,
  onComplaintUpdate,
}: UpdateComplaintModalProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [file, setFile] = useState<any[]>([]);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [tooltipError, setTooltipError] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);
  const id = complaintIdProp;
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [parentLocation, setParentLocation] = useState("");
  const [childLocation, setChildLocation] = useState("");
  const [blockLocation, setBlockLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const locationData = {
    Hostel: {
      10: ["A", "B", "C"],
      11: ["A", "B"],
    },
    Department: {
      CSE: ["A", "B"],
      ECE: ["A"],
    },
    Other: ["Library", "Sports Complex", "Cafeteria"],
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!isOpen || !complaintIdProp) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/complaint/get-complaint/${id}`);
        const data = await response.json();
        console.log(data);
        setComplaint(data);
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError("Failed to load complaint. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [isOpen, complaintIdProp]);

  useEffect(() => {
    if (complaint) {
      setFormData({
        complaintId: complaint.complaintId,
        title: complaint.title,
        description: complaint.description,
        access: complaint.access,
        location: complaint.location,
        tags: complaint.tags.map((tag: any) => tag.tags.id),
        attachments: complaint.attachments.map(
          (attachment: any) => attachment.imageUrl
        ),
        postAsAnonymous: complaint.postAsAnonymous,
      });
      const [parent, child, block] = complaint.location.split("-");
      setParentLocation(parent || "");
      setChildLocation(child || "");
      setBlockLocation(block || "");
      setError(null);
    }
  }, [complaint]);

  const handleEditLocation = () => setIsEditingLocation(!isEditingLocation); // Toggle location editing

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParentLocation(e.target.value);
    setChildLocation("");
    setFormData({ ...formData, location: e.target.value });
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChildLocation(e.target.value);
    setFormData({
      ...formData,
      location: `${parentLocation}-${e.target.value}`,
    });
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      location: `${parentLocation}-${childLocation}-${e.target.value}`,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile([...file, ...Array.from(e.target.files)]);
  };

  const handleUploadImages = async () => {
    try {
      const uploadedUrls: string[] = [];
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      for (const selectedFile of file) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setImageUploadProgress(progress);
            },
          }
        );

        uploadedUrls.push(res.data.url);
      }

      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...uploadedUrls],
      });
      setFile([]);
      setImageUploadProgress(null);
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images. Please try again.");
    }
  };

  const handleTagSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTagId = parseInt(e.target.value, 10); // Get tag ID

    if (!formData.tags.includes(selectedTagId)) {
      const updatedTags = [...formData.tags, selectedTagId];

      if (updatedTags.includes(8) || updatedTags.includes(22)) {
        //tagid for Ragging and personal issue
        setFormData({ ...formData, tags: updatedTags, access: "PRIVATE" });
      } else {
        setFormData({ ...formData, tags: updatedTags });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...complaint,
      title: formData.title,
      description: formData.description,
      access: formData.access,
      postAsAnonymous: formData.postAsAnonymous,
      location: formData.location,
      tags: formData.tags,
      attachments: formData.attachments,
    };
    console.log("Data to send: ", dataToSend);
    try {
      setSubmitting(true);
      const res = await fetch(`/api/v1/complaint/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = res.json();
      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      if (res.ok) {
        setCreateError(null);
        onClose();
        navigate(`/complaint/${formData.complaintId}`);
      }
    } catch (error) {
      console.log(error);
      setCreateError("Something went wrong");
    } finally{
      setSubmitting(false);
    }
  };

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
  const tagMapping = {
    1: "Hostel",
    2: "Mess",
    3: "Department",
    4: "Cleaning",
    5: "Sports",
    6: "Bus Services",
    8: "Ragging",
    9: "Gym",
    10: "Library",
    11: "Internet",
    12: "Wi-Fi",
    13: "LAN",
    14: "Electricity",
    15: "Equipment",
    16: "Carpentry",
    17: "Dispensary",
    18: "Ambulance",
    19: "Medical Services",
    20: "Canteen",
    21: "Labs",
    22: "Personal Issue",
    23: "Others",
  };

  const handleAccessChange = () => {
    if (formData.tags.includes(8) || formData.tags.includes(22)) {
      // Check if Ragging tag (id=8) is selected or Personal Issue (id=22)
      setTooltipError(true);
      setTimeout(() => setTooltipError(false), 3000); // Hide tooltip after 3 seconds
      return;
    }
    setFormData({
      ...formData,
      access: formData.access === "PRIVATE" ? "PUBLIC" : "PRIVATE",
    });
  };
  const resetForm = () => {
    setFormData({
      complaintId: complaint.complaintId,
      title: complaint.title,
      description: complaint.description,
      access: complaint.access,
      location: complaint.location,
      tags: complaint.tags.map((tag: any) => tag.tags.id),
      attachments: complaint.attachments.map(
        (attachment: any) => attachment.imageUrl
      ),
      postAsAnonymous: complaint.postAsAnonymous,
    });
    const [parent, child, block] = complaint.location.split("-");
    setParentLocation(parent || "");
    setChildLocation(child || "");
    setBlockLocation(block || "");
    setError(null);
  };

  const handleModalClose = () => {
    resetForm();
    setFormData(null);
    setError(null);
    setIsEditingLocation(false);
    setFile([]);
    setImageUploadProgress(null);
    setImageUploadError(null);
    onClose();
  };
  if (!isOpen || loading) return null;

  if (!complaint || !formData) {
    return (
      <Modal show={isOpen} onClose={handleModalClose}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body>
          <Alert color="failure">
            Failed to load complaint data. Please try again.
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }
  console.log(isOpen);
  return (
    <div>
      <Modal show={isOpen} size="5xl" onClose={handleModalClose} popup>
        <Modal.Header>Update Complaint</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Title" />
                </div>
                <TextInput
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  theme={customThemeTi}
                  className="focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                  rows={4}
                />
              </div>
              <div className="mb-2 float-left">
                <Label htmlFor="location" value="Location:" />
              </div>
              <div className="flex justify-between gap-8">
                {!isEditingLocation ? (
                  <div className="flex mt-2">
                    <Badge color="gray" className="float-right">
                      {complaint.location}
                    </Badge>{" "}
                    <AiOutlineEdit onClick={handleEditLocation} />
                  </div>
                ) : (
                  <div className="flex-1">
                    {/* Location - Parent */}
                    <div className="mb-4">
                      <Label
                        htmlFor="parentLocation"
                        value="Location Category"
                      />
                      <Select
                        id="parentLocation"
                        value={parentLocation}
                        onChange={handleParentChange}
                        required
                        theme={customThemeSelect}
                        color="gray"
                      >
                        <option value="">Select Category</option>
                        {Object.keys(locationData).map((parent, index) => (
                          <option key={index} value={parent}>
                            {parent}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Location - Child */}
                    {parentLocation && parentLocation !== "Other" && (
                      <div>
                        <Label
                          htmlFor="childLocation"
                          value="Specific Location"
                        />
                        <Select
                          id="childLocation"
                          value={childLocation}
                          onChange={handleChildChange}
                          required
                          theme={customThemeSelect}
                        >
                          <option value="">Select Specific Location</option>
                          {Object.keys(locationData[parentLocation]).map(
                            (child, index) => (
                              <option key={index} value={child}>
                                {child}
                              </option>
                            )
                          )}
                        </Select>
                      </div>
                    )}
                    {(parentLocation === "Hostel" ||
                      parentLocation === "Department") &&
                      childLocation &&
                      locationData[parentLocation][childLocation] && (
                        <div>
                          <Label htmlFor="block" value="Block" />
                          <Select
                            id="block"
                            onChange={handleBlockChange}
                            required
                            theme={customThemeSelect}
                            value={blockLocation}
                          >
                            <option value="">Select Block</option>
                            {locationData[parentLocation][childLocation].map(
                              (block, index) => (
                                <option key={index} value={block}>
                                  {block}
                                </option>
                              )
                            )}
                          </Select>
                        </div>
                      )}
                    {parentLocation === "Other" && (
                      <div>
                        <Label
                          htmlFor="childLocation"
                          value="Specific Location"
                        />
                        <Select
                          id="childLocation"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select Specific Location</option>
                          {locationData[parentLocation].map(
                            (location, index) => (
                              <option key={index} value={location}>
                                {location}
                              </option>
                            )
                          )}
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* Right Side - Tags */}
                <div className="flex-1">
                  <Label htmlFor="tags" value="Tags" />
                  <Select
                    id="tags"
                    value=""
                    onChange={handleTagSelection}
                    theme={customThemeSelect}
                    color="gray"
                  >
                    <option value="">Select a Tag</option>
                    {Object.entries(tagMapping).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tagId: number) => (
                      <span
                        key={tagId}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2"
                      >
                        {tagMapping[tagId]}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags.filter(
                                (id: number) => id !== tagId
                              ),
                            })
                          }
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-between border-4 border-[rgb(60,79,131)] border-dotted p-3">
                <FileInput
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                />
                <Button
                  onClick={handleUploadImages}
                  className="border border-[rgb(60,79,131)] focus:ring-4 focus:ring-[rgb(60,79,131)] enabled:hover:bg-[rgb(60,79,131)]"
                  size="sm"
                  outline
                  disabled={imageUploadProgress}
                >
                  {imageUploadProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress || 0}%`}
                        className="text-[rgb(60,79,131)] "
                        styles={buildStyles({
                          pathColor: "#3C4F83",
                        })}
                      />
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}
              {formData.attachments.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <img
                        src={attachment}
                        alt={`Uploaded ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            attachments: formData.attachments.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        className="absolute top-1 right-1 bg-gray-200 text-slate-600 p-1 rounded-full"
                      >
                        <IoClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="access"
                    className="text-2xl text-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                    checked={formData.access === "PUBLIC"}
                    onChange={handleAccessChange}
                  />
                  <Label htmlFor="access" className="text-sm">
                    Post Publicly
                  </Label>
                  {tooltipError && (
                    <Toast>
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                        <HiExclamation className="h-5 w-5" />
                      </div>
                      <div className="ml-3 text-sm font-normal">
                        Complaints with tags "Ragging" and "Personal Issues"
                        cannot be posted publicly
                      </div>
                      <Toast.Toggle />
                    </Toast>
                  )}
                  <Tooltip
                    content="Public complaints are visible to all users"
                    arrow={false}
                    placement="right"
                    animation="duration-500"
                    className="bg-[rgb(224,224,244)] text-slate-800"
                  >
                    <IoInformationCircleOutline />
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="anonymous"
                  checked={formData.postAsAnonymous}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      postAsAnonymous: !formData.postAsAnonymous,
                    })
                  }
                  className="text-2xl text-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                />
                <Label htmlFor="anonymous">Submit Anonymously</Label>
                <Tooltip
                  content="Your username will be hidden from other users"
                  arrow={false}
                  placement="right"
                  animation="duration-500"
                  className="bg-[rgb(224,224,244)] text-slate-800"
                >
                  <IoInformationCircleOutline />
                </Tooltip>
              </div>
              <Button
                type="submit"
                className="w-full mt-4 border border-transparent bg-[rgb(60,79,131)] text-white focus:ring-4 focus:ring-purple-300 enabled:hover:bg-[rgb(47,69,131)] dark:bg-purple-600 dark:focus:ring-purple-900 dark:enabled:hover:bg-purple-700"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Save Changes"}
              </Button>
            </div>
          </form>
          {error && <Alert color="failure">{error}</Alert>}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UpdateComplaintModal;
