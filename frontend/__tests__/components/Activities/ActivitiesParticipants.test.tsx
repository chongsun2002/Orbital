import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ActivitiesParticipants from '@/components/Activities/ActivitiesParticipants';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

describe('ActivitiesParticipants Component', () => {
  it('should display an error message when participantNames is undefined', () => {
    render(<ActivitiesParticipants participantNames={undefined} />);
    expect(screen.getByText(/could not get participants. try again later!/i)).toBeInTheDocument();
  });

  it('should display "No participants yet." when participantNames is an empty array', () => {
    render(<ActivitiesParticipants participantNames={[]} />);
    expect(screen.getByText(/no participants yet./i)).toBeInTheDocument();
  });

  it('should display the name of the participant when participantNames has one participant', () => {
    render(<ActivitiesParticipants participantNames={['John Doe']} />);
    expect(screen.getByText(/john doe has joined!/i)).toBeInTheDocument();
  });

  it('should display the first participant and the count of other participants when participantNames has multiple participants', () => {
    render(<ActivitiesParticipants participantNames={['John Doe', 'Jane Smith']} />);
    expect(screen.getByText(/john doe and 1 others have joined! click to see who else!/i)).toBeInTheDocument();
  });

  it('should display all participants in the dialog when it is triggered', async () => {
    const participantNames = ['John Doe', 'Jane Smith', 'Bob Johnson'];
    render(<ActivitiesParticipants participantNames={participantNames} />);
    
    const triggerButton = screen.getByText(/john doe and 2 others have joined! click to see who else!/i);
    userEvent.click(triggerButton);
    
    for (const participant of participantNames) {
      expect(await screen.findByText(participant)).toBeInTheDocument();
    }
  });
});