import * as React from "react";
import PropTypes from "prop-types";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, id, label, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {label && (
      <label htmlFor={id} className="text-sm text-foreground cursor-pointer">
        {label}
      </label>
    )}
  </div>
));
Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
};

export { Checkbox };
