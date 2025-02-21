import PropTypes from "prop-types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  onCategoryChange,
  hideSubmitButton = false,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "select": {
        let options = getControlItem.options;
        if (getControlItem.dependsOn) {
          const parentValue = formData[getControlItem.dependsOn];
          options = parentValue ? getControlItem.options[parentValue] : [];
        }
        
        element = (
          <Select
            onValueChange={(value) => {
              if (getControlItem.name === "category" && onCategoryChange) {
                onCategoryChange(value);
              }
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              });
            }}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;
      }

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = null;
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4">
        {formControls.map((controlItem) => (
          <div key={controlItem.name}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {controlItem.label}
            </label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      {!hideSubmitButton && (
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={isBtnDisabled}
        >
          {buttonText}
        </Button>
      )}
    </form>
  );
}

// Prop Types for CommonForm
CommonForm.propTypes = {
  formControls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      componentType: PropTypes.oneOf(["input", "select", "textarea"]),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  isBtnDisabled: PropTypes.bool,
  onCategoryChange: PropTypes.func,
  hideSubmitButton: PropTypes.bool,
};

export default CommonForm;