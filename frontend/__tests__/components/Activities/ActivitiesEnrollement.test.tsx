import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivitiesEnrollment from '@/components/Activities/ActivitiesEnrollment';
import { useRouter } from 'next/navigation';
import { joinActivity, unjoinActivity } from '@/lib/activityActions';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/activityActions', () => ({
  joinActivity: jest.fn(),
  unjoinActivity: jest.fn(),
}));

describe('ActivitiesEnrollment Button Component', () => {
    const useRouterMock = useRouter as jest.Mock;
    const joinActivityMock = joinActivity as jest.Mock;
    const unjoinActivityMock = unjoinActivity as jest.Mock;

    beforeEach(() => {
        useRouterMock.mockReturnValue({ refresh: jest.fn() });
        joinActivityMock.mockResolvedValue({});
        unjoinActivityMock.mockResolvedValue({});
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

  it('should display that the activity is over if the end time is in the past', () => {
    render(<ActivitiesEnrollment endTime="2000-01-01T00:00:00Z" isEnrolled={false} activityId="1" />);
    expect(screen.getByText(/this activity is over!/i)).toBeInTheDocument();
  });

  it('should display an error message if enrollment status is undefined', () => {
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={undefined} activityId="1" />);
    expect(screen.getByText(/could not get enrollment status. try again later!/i)).toBeInTheDocument();
  });

  it('should display the join button if the user is not enrolled', () => {
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={false} activityId="1" />);
    expect(screen.getByText(/join activity/i)).toBeInTheDocument();
  });

  it('should display the leave button if the user is enrolled', () => {
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={true} activityId="1" />);
    expect(screen.getByText(/leave activity/i)).toBeInTheDocument();
  });

  it('should handle join button click', async () => {
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={false} activityId="1" />);
    fireEvent.click(screen.getByText(/join activity/i));

    await waitFor(() => expect(joinActivityMock).toHaveBeenCalledWith("1"));
    await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
  });

  it('should handle leave button click', async () => {
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={true} activityId="1" />);
    fireEvent.click(screen.getByText(/leave activity/i));

    await waitFor(() => expect(unjoinActivityMock).toHaveBeenCalledWith("1"));
    await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
  });

  it('should display loading spinner and text when joining', async () => {
    joinActivityMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))); // Mock delayed response
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={false} activityId="1" />);
    fireEvent.click(screen.getByText(/join activity/i));

    expect(screen.getByText(/joining.../i)).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should display loading spinner and text when leaving', async () => {
    unjoinActivityMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))); // Mock delayed response
    render(<ActivitiesEnrollment endTime="3000-01-01T00:00:00Z" isEnrolled={true} activityId="1" />);
    fireEvent.click(screen.getByText(/leave activity/i));

    expect(screen.getByText(/leaving.../i)).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
})