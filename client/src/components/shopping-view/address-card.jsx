import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo = {}, // ✅ Default empty object to prevent errors
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={() => setCurrentSelectedAddress?.(addressInfo)} // ✅ Prevents null function issue
      className={`cursor-pointer ${
        selectedId?._id === addressInfo?._id
          ? "border-4 border-red-900" // ✅ Ensures Tailwind compatibility
          : "border border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo.address || "N/A"}</Label>
        <Label>City: {addressInfo.city || "N/A"}</Label>
        <Label>Pincode: {addressInfo.pincode || "N/A"}</Label>
        <Label>Phone: {addressInfo.phone || "N/A"}</Label>
        <Label>Notes: {addressInfo.notes || "N/A"}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress?.(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress?.(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

// ✅ Add PropTypes for validation
AddressCard.propTypes = {
  addressInfo: PropTypes.shape({
    _id: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    pincode: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string,
  }),
  handleDeleteAddress: PropTypes.func.isRequired,
  handleEditAddress: PropTypes.func.isRequired,
  setCurrentSelectedAddress: PropTypes.func,
  selectedId: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

// ✅ Default props (optional, prevents issues if not passed)
AddressCard.defaultProps = {
  addressInfo: {},
  setCurrentSelectedAddress: null,
  selectedId: null,
};

export default AddressCard;
