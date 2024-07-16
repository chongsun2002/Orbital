import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivitiesFilter from '@/components/Activities/ActivitiesFilter';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, children }: { onValueChange: (value: string) => void, children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SelectTrigger: ({ className, children }: { className: string, children: React.ReactNode }) => (
        <button className={className}>{children}</button>
    ),
    SelectValue: ({ placeholder }: { placeholder: string }) => <div>{placeholder}</div>,
    SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectItem: ({ value, children }: { value: string, children: React.ReactNode }) => (
        <div onClick={() => fireEvent.click(screen.getByText(children as string))}>{children}</div>
    ),
}));

describe('ActivitiesFilter Component', () => {
    const mockUsePathname = usePathname as jest.Mock;
    const mockUseSearchParams = useSearchParams as jest.Mock;
    const mockUseRouter = useRouter as jest.Mock;
    const mockReplace = jest.fn();

    beforeEach(() => {
        mockUsePathname.mockReturnValue('/activities');
        mockUseSearchParams.mockReturnValue(new URLSearchParams());
        mockUseRouter.mockReturnValue({ replace: mockReplace });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update URL when category filter is changed', () => {
        render(<ActivitiesFilter />);

        fireEvent.click(screen.getByText('Category'));
        fireEvent.click(screen.getByText('Option 1'));

        expect(mockReplace).toHaveBeenCalledWith('/activities?category=option1');
    });

    it('should update URL when date filter is changed', () => {
        render(<ActivitiesFilter />);

        fireEvent.click(screen.getByText('Date'));
        fireEvent.click(screen.getByText('Option 1'));

        expect(mockReplace).toHaveBeenCalledWith('/activities?date=option1');
    });

    it('should update URL when location filter is changed', () => {
        render(<ActivitiesFilter />);

        fireEvent.click(screen.getByText('Location'));
        fireEvent.click(screen.getByText('Option 1'));

        expect(mockReplace).toHaveBeenCalledWith('/activities?location=option1');
    });

    it('should clear all filters when the "Clear Filters" button is clicked', () => {
        render(<ActivitiesFilter />);

        fireEvent.click(screen.getByText('Clear Filters'));

        expect(mockReplace).toHaveBeenCalledWith('/activities');
    });
});