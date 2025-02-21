import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import PropTypes from "prop-types";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImageLoadingState(true);

      const formData = new FormData();
      formData.append("my_file", file);

      try {
        const response = await axios.post(
          "https://clothing-store-ta8c.onrender.com/api/admin/products/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          setUploadedImageUrl(response.data.imageUrl);
          setImageLoadingState(false);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageLoadingState(false);
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageUpload}
          accept="image/*"
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>

      {/* Display the uploaded image if available */}
      {uploadedImageUrl && (
        <div className="mt-2 flex justify-center">
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}

ProductImageUpload.propTypes = {
  imageFile: PropTypes.object, // Since it's a File object
  setImageFile: PropTypes.func.isRequired, // Function to update imageFile
  imageLoadingState: PropTypes.bool.isRequired, // Boolean state
  uploadedImageUrl: PropTypes.string, // URL of uploaded image
  setUploadedImageUrl: PropTypes.func.isRequired, // Function to update image URL
  setImageLoadingState: PropTypes.func.isRequired, // Function to update loading state
  isEditMode: PropTypes.bool.isRequired, // Boolean flag for edit mode
  isCustomStyling: PropTypes.bool, // Optional boolean with default false
};

export default ProductImageUpload;
