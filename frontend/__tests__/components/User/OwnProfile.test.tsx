import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OwnProfile from '@/components/User/OwnProfile';
import { updateUserDetails } from '@/lib/userActions';

jest.mock('@/lib/friendsActions', () => ({
    updateUserDetails: jest.fn(),
}));

describe('Public Profile test', () => {
    const updateUserDetailsMock = updateUserDetails as jest.Mock;

    beforeEach(() => {
        updateUserDetailsMock.mockResolvedValue({});
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display button to save changes', () => {
        render(<OwnProfile user={{name: 'testUser'}} />);
        expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
    });

    it('should handle clicking save changes button', async () => {
        render(<OwnProfile user={{name: 'testUser'}} />);
        fireEvent.click(screen.getByText(/Save Changes/i));
        await waitFor(() => expect(updateUserDetailsMock).toHaveBeenCalledWith("testUser"));
    })

    it('should display spinner and text after clicking save changes button', () => {
        render(<OwnProfile user={{name: 'testUser'}} />);
        fireEvent.click(screen.getByText(/Save Changes/i));
        expect(screen.getByText(/Please Wait.../i)).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    })
})