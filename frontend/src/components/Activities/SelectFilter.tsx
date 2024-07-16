import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SelectFilterProps {
    urlParamName: string;
    filterName: string
    filterOptions: {
        value: string,
        name: string
    }[];
    className: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({urlParamName, filterName, filterOptions, className}: SelectFilterProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace, refresh } = useRouter();

    const onValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(urlParamName, value);
        } else {
            params.delete(urlParamName);
        }
        replace(`${pathname}?${params.toString()}`);
        refresh();
    }
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