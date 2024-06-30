import * as React from "react"

import { cn } from "@/lib/utils"

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "border-[3px] border-t-blue-700 border-r-blue-700 rounded-full w-[24px] h-[24px] animate-spin",
          className
        )}
        ref={ref}
        data-testid="spinner"
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
