import PropTypes from "prop-types";
import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  // Get the selected main category
  const selectedCategory = filters?.category?.[0];

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Main Categories */}
        <Fragment>
          <div>
            <h3 className="text-base font-bold">Category</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions.category.map((option) => (
                <Label key={option.id} className="flex font-medium items-center gap-2">
                  <Checkbox
                    checked={filters?.category?.includes(option.id)}
                    onCheckedChange={() => handleFilter("category", option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
          <Separator />
        </Fragment>

        {/* Sub Categories - Only show if a main category is selected */}
        {selectedCategory && filterOptions.subCategory[selectedCategory] && (
          <Fragment>
            <div>
              <h3 className="text-base font-bold">Sub Category</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions.subCategory[selectedCategory].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2">
                    <Checkbox
                      checked={filters?.subCategory?.includes(option.id)}
                      onCheckedChange={() => handleFilter("subCategory", option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        )}

        {/* Sizes - Only show for clothing and footwear */}
        {selectedCategory && selectedCategory !== "accessories" && filterOptions.size[selectedCategory] && (
          <Fragment>
            <div>
              <h3 className="text-base font-bold">Size</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions.size[selectedCategory].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2">
                    <Checkbox
                      checked={filters?.size?.includes(option.id)}
                      onCheckedChange={() => handleFilter("size", option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        )}

        {/* Colors */}
        <Fragment>
          <div>
            <h3 className="text-base font-bold">Color</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions.color.map((option) => (
                <Label key={option.id} className="flex font-medium items-center gap-2">
                  <Checkbox
                    checked={filters?.color?.includes(option.id)}
                    onCheckedChange={() => handleFilter("color", option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
          <Separator />
        </Fragment>

        {/* Brands */}
        <Fragment>
          <div>
            <h3 className="text-base font-bold">Brand</h3>
            <div className="grid gap-2 mt-2">
              {filterOptions.brand.map((option) => (
                <Label key={option.id} className="flex font-medium items-center gap-2">
                  <Checkbox
                    checked={filters?.brand?.includes(option.id)}
                    onCheckedChange={() => handleFilter("brand", option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}

// ✅ PropTypes Validation
ProductFilter.propTypes = {
  filters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  handleFilter: PropTypes.func.isRequired,
};

export default ProductFilter;
