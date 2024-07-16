import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivitiesPagination from '@/components/Activities/ActivitiesPagination';
import { usePathname, useSearchParams } from 'next/navigation';

// Mock next/link directly in the test file
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('ActivitiesPagination Component', () => {
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/activities');
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'page') return '1';
        return null;
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display pagination ellipsis when there are more pages', () => {
    render(<ActivitiesPagination totalPages={5} />);
    expect(screen.getByTestId('pagination-ellipsis')).toBeInTheDocument();
  });

  it('should render pagination links correctly for multiple pages', () => {
    render(<ActivitiesPagination totalPages={5} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-ellipsis')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('should handle previous and next links correctly', () => {
    mockUseSearchParams.mockReturnValueOnce({
      get: (key: string) => {
        if (key === 'page') return '3';
        return null;
      },
    });
    render(<ActivitiesPagination totalPages={5} />);
    expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
  });

  it('should not render the next link on the last page', () => {
    mockUseSearchParams.mockReturnValueOnce({
      get: (key: string) => {
        if (key === 'page') return '5';
        return null;
      },
    });
    render(<ActivitiesPagination totalPages={5} />);
    expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument();
  });

  it('should not render the previous link on the first page', () => {
    render(<ActivitiesPagination totalPages={5} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
  });
});