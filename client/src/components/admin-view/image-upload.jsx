import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import PropTypes from "prop-types";
import { toast } from "../ui/use-toast";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  setFormData,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
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

  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      
      if (!imageFile) {
        throw new Error("No file selected");
      }

      console.log("Preparing to upload file:", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });

      const data = new FormData();
      data.append("my_file", imageFile);

      // Get the token from wherever you store it (localStorage, Redux, etc.)
      const token = localStorage.getItem('token'); // adjust based on your auth setup

      const response = await axios.post(
        "https://clothing-store-ta8c.onrender.com/api/admin/products/upload-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // Add if you're using token auth
          },
          withCredentials: true,
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );

      console.log("Server response:", response.data);

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.secure_url);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        serverMessage: error.response?.data?.error?.message
      });

      toast({
        title: "Upload failed",
        description: error.response?.data?.error?.message || error.message,
        variant: "destructive"
      });
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  useEffect(() => {
    console.log("Current uploadedImageUrl:", uploadedImageUrl);
  }, [uploadedImageUrl]);

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
          onChange={handleImageFileChange}
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

      {/* Only show the image if uploadedImageUrl is a string */}
      {uploadedImageUrl && typeof uploadedImageUrl === 'string' && (
        <div className="mt-4">
          <img
            src={uploadedImageUrl}
            alt="Uploaded product"
            className="mt-2 max-w-full h-auto rounded-lg shadow-md"
            onError={(e) => console.error("Image load error:", e)}
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
  setFormData: PropTypes.func, // Optional function to update form data
};

export default ProductImageUpload;
