import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timetable from '@/components/CourseMatching/Timetable';

describe('Public Profile test', () => {
    it('should display relevant courses', () => {
        render(<Timetable NUSModsURLs={[{name: "testUser", url: 'https://nusmods.com/timetable/sem-1/share?CS2103T=LEC:G18'}]} />);
        expect(screen.getByText(/CS2103T/i)).toBeInTheDocument();
    });
})