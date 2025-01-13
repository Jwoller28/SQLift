import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotiViewerNew from '../../../src/Components/Inbox/NotiViewerNew';
import { getTrackers } from '../../../src/API/Axios';
/**
 * @jest-environment jsdom
 */

jest.mock('../../../src/API/Axios', () => ({
    getUserByUsername: jest.fn(),
    usernameifAuthorized: jest.fn(),
    getTrackers: jest.fn(),
  }));

describe('NotiViewerNew Component', () => {
    const mockTrackers = [
        {
            createdAt: new Date(),
            exercise: { caloriesBurned: 200, duration: 30, volume: 100 },
            nutrition: { carb: 50, fat: 20, kal: 2000, protein: 100, weight: 70 },
            sleep: 8,
            water: 2,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={false} />);
        expect(getByText('Loading...')).toBeInTheDocument();
    });

    it('should fetch trackers on mount when userId and goalId are valid', async () => {
        (getTrackers as jest.Mock).mockResolvedValue(mockTrackers);

        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={true} />);

        await waitFor(() => {
            expect(getTrackers).toHaveBeenCalledWith(1, 1);
            expect(getByText('Loading...')).not.toBeInTheDocument();
        });
    });

    it('should display charts when data is fetched and clicked is true', async () => {
        (getTrackers as jest.Mock).mockResolvedValue(mockTrackers);

        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={true} />);

        await waitFor(() => {
            expect(getByText('burnedCal')).toBeInTheDocument();
            expect(getByText('duration')).toBeInTheDocument();
            expect(getByText('volume')).toBeInTheDocument();
            expect(getByText('carb')).toBeInTheDocument();
            expect(getByText('fat')).toBeInTheDocument();
            expect(getByText('kal')).toBeInTheDocument();
            expect(getByText('protein')).toBeInTheDocument();
            expect(getByText('weight')).toBeInTheDocument();
            expect(getByText('sleep')).toBeInTheDocument();
            expect(getByText('water')).toBeInTheDocument();
        });
    });

    it('should not display charts when clicked is false', async () => {
        (getTrackers as jest.Mock).mockResolvedValue(mockTrackers);

        const { queryByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={false} />);

        await waitFor(() => {
            expect(queryByText('burnedCal')).not.toBeInTheDocument();
            expect(queryByText('duration')).not.toBeInTheDocument();
            expect(queryByText('volume')).not.toBeInTheDocument();
            expect(queryByText('carb')).not.toBeInTheDocument();
            expect(queryByText('fat')).not.toBeInTheDocument();
            expect(queryByText('kal')).not.toBeInTheDocument();
            expect(queryByText('protein')).not.toBeInTheDocument();
            expect(queryByText('weight')).not.toBeInTheDocument();
            expect(queryByText('sleep')).not.toBeInTheDocument();
            expect(queryByText('water')).not.toBeInTheDocument();
        });
    });
});