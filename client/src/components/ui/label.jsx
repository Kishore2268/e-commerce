import * as React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));

Label.displayName = LabelPrimitive.Root.displayName;

// ✅ Add PropTypes validation
Label.propTypes = {
  className: PropTypes.string,
};

// ✅ Set default props (optional)
Label.defaultProps = {
  className: "",
};

export { Label };
