import axios from "axios";
import {
  Alert,
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
import React, { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiExclamation } from "react-icons/hi";
import Lightbox from "yet-another-react-lightbox";
import Masonry from "react-masonry-css";

const CreateComplaintModal = ({
  isOpen,
  onClose,
  tagsFromBackend,
}: {
  isOpen: boolean;
  onClose: () => void;
  tagsFromBackend: { id: number; name: string }[];
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    access: "PUBLIC",
    location: "",
    attachments: [],
    tags: [],
    postAsAnonymous: false,
  });

  const [parentLocation, setParentLocation] = useState("");
  const [childLocation, setChildLocation] = useState("");
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [tooltipError, setTooltipError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(-1);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  //TODO: Handle these from the backend + location values in select option
  const locationData = {
    Hostel: {
      10: ["A", "B", "C"], // Hostel 10 has blocks A, B, C
      11: ["A", "B"], // Hostel 11 has blocks A, B
      12: ["A", "B", "C", "D"], // Hostel 12 has blocks A, B, C, D
    },
    Department: {
      CSE: ["A", "B"],
      ECE: ["A"],
      EE: ["A", "B"],
      ME: ["A", "B"],
    },
    Other: ["Sports Complex", "Library", "Bus Services", "Ragging", "Other"],
  };

  //TODO: Handle from backend
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      access: "PUBLIC",
      location: "",
      attachments: [],
      tags: [],
      postAsAnonymous: false,
    });
    setParentLocation("");
    setChildLocation("");
    setFile(null);
    setImageUploadProgress(null);
    setImageUploadError(null);
    setCreateError(null);
    setTooltipError(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
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

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedParent = e.target.value;
    setParentLocation(selectedParent);
    setChildLocation(""); // Reset child location

    if (selectedParent === "Other") {
      setFormData({ ...formData, location: "" });
    } else {
      setFormData({ ...formData, location: selectedParent });
    }
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChild = e.target.value;
    setChildLocation(selectedChild);

    // Combine parent and child for "Hostel" and "Department"
    if (parentLocation !== "Other") {
      setFormData({
        ...formData,
        location: `${parentLocation}-${selectedChild}`,
      });
    }
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBlock = e.target.value;

    // Combine parent, child, and block for "Hostel" or "Department"
    if (parentLocation !== "Other") {
      setFormData({
        ...formData,
        location: `${parentLocation}-${childLocation}-${selectedBlock}`,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

  //TODO: Change this after backend fetching
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

  const handleUploadImage = async () => {
    try {
      if (!file || file.length === 0) {
        setImageUploadError("Please select at least one image");
        return;
      }

      const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const uploadedUrls = [];
      for (const selectedFile of file) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", upload_preset);
        data.append("cloud_name", cloud_name);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          data,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setImageUploadProgress(progress);
            },
          }
        );

        const uploadedImageUrl = res.data.url;
        uploadedUrls.push(uploadedImageUrl);
      }

      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...uploadedUrls],
      });
      setImageUploadProgress(null);
      setImageUploadError(null);
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  //TODO: Change logic for preview
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    //validations
    if (!formData.title || !formData.description || !formData.location) {
      setCreateError("Please fill all the fields");
    }

    if (formData.title.length < 3) {
      setCreateError("Title must be at least 3 characters long");
    }

    if (formData.description.length < 3) {
      setCreateError("Description must be at least 3 characters long");
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/v1/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      if (res.ok) {
        setCreateError(null);
        resetForm();
        navigate("/");
        onClose();
      }
    } catch (error) {
      console.log(error);
      setCreateError("Error creating complaint. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} size="5xl" onClose={handleModalClose} popup>
      <Modal.Header />
      <Modal.Body>
        {step === 1 && (
          <div>
            <div className="space-y-6">
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                Facing an issue?
              </h2>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Title" />
                </div>
                <TextInput
                  id="title"
                  placeholder="What seems to be the issue?"
                  theme={customThemeTi}
                  className="focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                  required
                  onChange={handleChange}
                  color="gray"
                  value={formData.title}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the issue"
                  required
                  rows={4}
                  onChange={handleChange}
                  className="focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                  value={formData.description}
                />
              </div>
              <div className="flex justify-between gap-8">
                <div className="flex-1">
                  {/* Location - Parent */}
                  <div className="mb-4">
                    <Label htmlFor="parentLocation" value="Location Category" />
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
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Specific Location</option>
                        {locationData[parentLocation].map((location, index) => (
                          <option key={index} value={location}>
                            {location}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>

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
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.tags.map((tagId) => (
                      <span
                        key={tagId}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2"
                      >
                        {tagMapping[tagId]}{" "}
                        {/* Get tag name from the mapping */}
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags.filter((id) => id !== tagId),
                            })
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-4 items-center justify-between border-4 border-[rgb(60,79,131)] border-dotted p-3">
                  <FileInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setFile(e.target.files)}
                    className="border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)]"
                  />
                  <Button
                    type="button"
                    className="border border-[rgb(60,79,131)] focus:ring-4 focus:ring-[rgb(60,79,131)] enabled:hover:bg-[rgb(60,79,131)]"
                    size="sm"
                    outline
                    onClick={handleUploadImage}
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
              </div>
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
            </div>
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 w-full"
              outline
              gradientDuoTone="purpleToBlue"
            >
              Preview Complaint
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-medium text-gray-900 underline">
              Preview Complaint
            </h2>
            <p>
              <strong>Title:</strong> {formData.title}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>

            <p className="flex items-center gap-2">
              <strong>Location:</strong> {formData.location}
              <Tooltip content="This cannot be edited later">
                <IoInformationCircleOutline />
              </Tooltip>
            </p>

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              <p className="flex items-center gap-2">
                <strong>Tags:</strong>
              </p>
              {formData.tags.map((tagId) => (
                <span
                  key={tagId}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
                >
                  {tagMapping[tagId] || "Unknown"}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <p className="flex items-center gap-2">
                <strong>Access:</strong>
              </p>
              {formData.access === "PUBLIC" ? (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  Public
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  Private
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <p className="flex items-center gap-2">
                <strong>Post As Anonymous:</strong>
              </p>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {formData.postAsAnonymous ? "Yes" : "No"}
              </span>
            </div>

            {/* Lightbox Photo Gallery */}
            {formData.attachments.length > 0 && (
              <div className="mt-4">
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex gap-4"
                  columnClassName="masonry-column"
                >
                  {formData.attachments.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="rounded shadow-lg cursor-pointer m-5"
                      onClick={() => {
                        setLightboxOpen(true);
                        setLightboxIndex(index);
                      }}
                    />
                  ))}
                </Masonry>
              </div>
            )}
            <Lightbox
              open={lightboxOpen}
              close={() => {
                setLightboxOpen(false);
                setLightboxIndex(-1);
              }}
              index={lightboxIndex}
              slides={formData.attachments.map((url) => ({ src: url }))}
            />

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  // console.log(formData);
                  setFormData(formData);
                  setStep(1);
                }}
                outline
                gradientDuoTone="purpleToBlue"
              >
                Edit
              </Button>
              <Button
                onClick={handleSubmit}
                outline
                gradientDuoTone="purpleToBlue"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        )}

        {createError && <Alert color="failure">{createError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default CreateComplaintModal;
