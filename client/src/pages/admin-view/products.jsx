import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements, clothingSizes, footwearSizes } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  subCategory: "",
  brand: "",
  price: "",
  salePrice: "",
  sizes: {
    clothing: [],
    footwear: [],
  },
  stock: 0,
  colors: [],
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [sizeStockInputs, setSizeStockInputs] = useState([]);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleCategoryChange(category) {
    setFormData(prev => ({
      ...prev,
      category,
      subCategory: "", // Reset subcategory when category changes
      sizes: {
        clothing: [],
        footwear: [],
      },
      stock: 0,
    }));

    // Set up size inputs based on category
    if (category === "clothing") {
      setSizeStockInputs(clothingSizes.map(size => ({
        size: size.id,
        stock: 0
      })));
    } else if (category === "footwear") {
      setSizeStockInputs(footwearSizes.map(size => ({
        size: size.id,
        stock: 0
      })));
    } else {
      setSizeStockInputs([]);
    }
  }

  function handleSizeStockChange(sizeId, stock) {
    const newSizeStockInputs = sizeStockInputs.map(item =>
      item.size === sizeId ? { ...item, stock: parseInt(stock) || 0 } : item
    );
    setSizeStockInputs(newSizeStockInputs);

    // Update formData with new sizes
    const category = formData.category;
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [category]: newSizeStockInputs
      },
      totalStock: newSizeStockInputs.reduce((sum, item) => sum + item.stock, 0)
    }));
  }

  function onSubmit(event) {
    event.preventDefault();
    
    // Check if image is uploaded
    if (!uploadedImageUrl && !currentEditedId) {
      toast({
        title: "Please upload an image",
        variant: "destructive"
      });
      return;
    }

    const submitData = {
      ...formData,
      image: uploadedImageUrl, // Add the uploaded image URL
      ...(formData.category === "accessories" && { stock: formData.totalStock })
    };

    if (currentEditedId !== null) {
      dispatch(editProduct({
        id: currentEditedId,
        formData: submitData,
      }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImageUrl(""); // Reset image URL
        }
      });
    } else {
      dispatch(addNewProduct(submitData))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setUploadedImageUrl(""); // Reset image URL
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
          });
        } else {
          toast({
            title: "Failed to add product",
            description: data?.payload?.message || "Unknown error occurred",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive"
        });
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => {
        if (key === "image") {
          return currentEditedId !== null || uploadedImageUrl !== "";
        }
        return formData[key] !== "";
      })
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(formData, "productList");

  // Render size/stock inputs based on category
  const renderSizeStockInputs = () => {
    if (formData.category === "accessories") {
      return (
        <div className="grid w-full gap-1.5">
          <Label>Stock</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              stock: parseInt(e.target.value) || 0,
              totalStock: parseInt(e.target.value) || 0
            }))}
          />
        </div>
      );
    }

    return sizeStockInputs.map(({ size, stock }) => (
      <div key={size} className="grid grid-cols-2 gap-2">
        <div className="text-sm">{size.toUpperCase()}</div>
        <Input
          type="number"
          value={stock}
          onChange={(e) => handleSizeStockChange(size, e.target.value)}
          placeholder="Stock"
        />
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem.id || productItem._id} // Ensure a unique key
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              onCategoryChange={handleCategoryChange}
              hideSubmitButton={true}
            />
          </div>
          {formData.category && (
            <div className="mt-4">
              <Label>Size & Stock Management</Label>
              <div className="grid gap-2 mt-2">
                {renderSizeStockInputs()}
              </div>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={onSubmit}
              disabled={!isFormValid()}
              className="w-full"
            >
              {currentEditedId !== null ? "Edit Product" : "Add Product"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
