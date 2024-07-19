import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublicProfile from '@/components/User/PublicProfile';
import { useRouter } from 'next/navigation';
import { sendFriendRequest, unsendFriendRequest, removeFriend } from '@/lib/friendsActions';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/friendsActions', () => ({
    sendFriendRequest: jest.fn(),
    unsendFriendRequest: jest.fn(),
    removeFriend: jest.fn(),
}));

describe('Public Profile test', () => {
    const useRouterMock = useRouter as jest.Mock;
    const sendFriendRequestMock = sendFriendRequest as jest.Mock;
    const unsendFriendRequestMock = unsendFriendRequest as jest.Mock;
    const removeFriendMock = removeFriend as jest.Mock;

    beforeEach(() => {
        useRouterMock.mockReturnValue({ refresh: jest.fn() });
        sendFriendRequestMock.mockResolvedValue({});
        unsendFriendRequestMock.mockResolvedValue({});
        removeFriendMock.mockResolvedValue({});
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    //send button
    it('should display buttons to send a friend request if the users are not friends and a request has not been sent', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={false}/>);
        expect(screen.getByText(/Send Friend Request/i)).toBeInTheDocument();
        expect(screen.getByText(/Send Anonymous Friend Request/i)).toBeInTheDocument();
    });

    it('should handle clicking send friend request button', async () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={false}/>);
        fireEvent.click(screen.getByText(/Send Friend Request/i));
        await waitFor(() => expect(sendFriendRequestMock).toHaveBeenCalledWith("testUser", false));
        await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
    })

    it('should handle clicking send anonymous friend request button', async () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={false}/>);
        fireEvent.click(screen.getByText(/Send Anonymous Friend Request/i));
        await waitFor(() => expect(sendFriendRequestMock).toHaveBeenCalledWith("testUser", true));
        await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
    })

    it('should display spinner and text after clicking send button', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={false}/>);
        fireEvent.click(screen.getByText(/Send Friend Request/i));
        expect(screen.getByText(/Sending.../i)).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    })

    it('should display spinner and text after clicking anonymous send button', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={false}/>);
        fireEvent.click(screen.getByText(/Send Anonymous Friend Request/i));
        expect(screen.getByText(/Sending.../i)).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    })

    //unsend button
    it('should display a button to unsend a friend request if the users are not friends and a request has been sent', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={true}/>);
        expect(screen.getByText(/Unsend Request/i)).toBeInTheDocument();
    });

    it('should handle clicking unsend friend request button', async () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={true}/>);
        fireEvent.click(screen.getByText(/Unsend Request/i));
        await waitFor(() => expect(unsendFriendRequestMock).toHaveBeenCalledWith("testUser"));
        await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
    })

    it('should display spinner and text after clicking unsend button', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={false} hasRequested={true}/>);
        fireEvent.click(screen.getByText(/Unsend Request/i));
        expect(screen.getByText(/Unsending.../i)).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    })

    //remove friend button
    it('should display a button to remove friend if the users are friends', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={true} hasRequested={true}/>);
        expect(screen.getByText(/Remove Friend/i)).toBeInTheDocument();
    });
 
    it('should handle clicking remove friend button', async () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={true} hasRequested={true}/>);
        fireEvent.click(screen.getByText(/Remove Friend/i));
        await waitFor(() => expect(removeFriendMock).toHaveBeenCalledWith("testUser"));
        await waitFor(() => expect(useRouterMock().refresh).toHaveBeenCalled());
    })

    it('should display spinner and text after clicking remove friend button', () => {
        render(<PublicProfile id='testId' user={{name: 'testUser'}} isFriends={true} hasRequested={true}/>);
        fireEvent.click(screen.getByText(/Remove Friend/i));
        expect(screen.getByText(/Removing.../i)).toBeInTheDocument();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    })
})