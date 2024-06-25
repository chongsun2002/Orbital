"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button";
import { LuArrowUp } from "react-icons/lu";
import { LuArrowDown } from "react-icons/lu";


export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    max?: number;
    min?: number;
    step?: number;
  }

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ className, type, max, min, step, value, onChange, ...props }, ref) => {

        const handleIncrement = () => {
            if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
                const newValue = Number(value) + (step || 1);
                if (max !== undefined && newValue > max) return;
                onChange?.({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
            }
        };

            const handleDecrement = () => {
            if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
                const newValue = Number(value) - (step || 1);
                if (min !== undefined && newValue < min) return;
                onChange?.({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
            }
        };

        return (
            <div className="flex flex-row">
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    max={max}
                    min={min}
                    step={step}
                    {...props}
                />
                <div className="flex flex-col">
                    <Button onClick={handleIncrement} className="h-5 rounded-l-none rounded-br-none border-b-[0.1px]" type="button">
                        <LuArrowUp />
                    </Button>
                    <Button onClick={handleDecrement} className="h-5 rounded-l-none rounded-tr-none border-t-[0.1px]" type="button">
                        <LuArrowDown />
                    </Button>
                </div>
            </div>
        )
    }
)

NumberInput.displayName = "NumberInput"

export { NumberInput }