import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface SelectFilterProps {
    onValueChange: (value: string) => void;
    filterName: string;
    filterOptions: string[];
    className: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({onValueChange, filterName, filterOptions, className}: SelectFilterProps) => {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={filterName} />
            </SelectTrigger>
            <SelectContent>
                {filterOptions.map((option, index) => <SelectItem value={option} key={index}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>)}
            </SelectContent>
        </Select>
    )
}

export default SelectFilter;