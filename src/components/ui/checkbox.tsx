
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// CheckboxGroup is a compound component for checkbox groups
const CheckboxGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
}>({
  value: [],
  onValueChange: () => {},
});

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string[];
    onValueChange?: (value: string[]) => void;
    defaultValue?: string[];
  }
>(({ value, onValueChange, defaultValue = [], className, children, ...props }, ref) => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>(defaultValue);
  
  const contextValue = React.useMemo(() => ({
    value: value || selectedItems,
    onValueChange: (newValue: string[]) => {
      if (!value) {
        setSelectedItems(newValue);
      }
      onValueChange?.(newValue);
    },
  }), [value, selectedItems, onValueChange]);
  
  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div ref={ref} className={cn("flex flex-col space-y-2", className)} {...props}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, "checked" | "onCheckedChange"> & {
    value?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ children, value, checked, onCheckedChange, className, ...props }, ref) => {
  const group = React.useContext(CheckboxGroupContext);
  const isInGroup = value !== undefined;
  
  const isChecked = isInGroup 
    ? group.value.includes(value)
    : checked;
  
  const handleCheckedChange = (newChecked: boolean) => {
    if (isInGroup) {
      const newValue = newChecked
        ? [...group.value, value]
        : group.value.filter(v => v !== value);
      
      group.onValueChange(newValue);
    }
    
    onCheckedChange?.(newChecked);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        ref={ref}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className={cn("", className)}
        {...props}
      />
      <label htmlFor={props.id} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
      </label>
    </div>
  );
});
CheckboxItem.displayName = "CheckboxItem";

export { Checkbox, CheckboxGroup, CheckboxItem };
