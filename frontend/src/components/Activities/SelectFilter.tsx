import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface SelectFilterProps {
    onValueChange: (value: string) => void;
    filterName: string
    filterOptions: {
        value: string,
        name: string
    }[];
    className: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({onValueChange, filterName, filterOptions, className}: SelectFilterProps) => {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={filterName} />
            </SelectTrigger>
            <SelectContent>
                {filterOptions.map((option, index) => <SelectItem value={option.value} key={index}>{option.name}</SelectItem>)}
            </SelectContent>
        </Select>
    )
}

export default SelectFilter;