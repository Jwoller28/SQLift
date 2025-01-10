import React from 'react';
import { render, waitFor } from '@testing-library/react';
import NotiViewerNew from '../NotiViewerNew';
import { getTrackers } from '../../../API/Axios';

jest.mock('../../../API/Axios');

describe('NotiViewerNew', () => {
    const mockGetTrackers = getTrackers as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch trackers on mount', async () => {
        const trackers = [
            {
                createdAt: '2023-01-01',
                exercise: { caloriesBurned: 500, duration: 60, volume: 100 },
                nutrition: { carb: 300, fat: 70, kal: 2000, protein: 150, weight: 180 },
                sleep: 8,
                water: 64,
            },
        ];
        mockGetTrackers.mockResolvedValue(trackers);

        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={true} />);

        await waitFor(() => {
            expect(mockGetTrackers).toHaveBeenCalledWith(1, 1);
            expect(getByText('carb')).toBeInTheDocument();
            expect(getByText('fat')).toBeInTheDocument();
            expect(getByText('kal')).toBeInTheDocument();
            expect(getByText('protein')).toBeInTheDocument();
            expect(getByText('weight')).toBeInTheDocument();
            expect(getByText('sleep')).toBeInTheDocument();
            expect(getByText('water')).toBeInTheDocument();
        });
    });

    it('should render charts', async () => {
        const trackers = [
            {
                createdAt: '2023-01-01',
                exercise: { caloriesBurned: 500, duration: 60, volume: 100 },
                nutrition: { carb: 300, fat: 70, kal: 2000, protein: 150, weight: 180 },
                sleep: 8,
                water: 64,
            },
        ];
        mockGetTrackers.mockResolvedValue(trackers);

        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={true} />);

        await waitFor(() => {
            expect(getByText('carb')).toBeInTheDocument();
            expect(getByText('fat')).toBeInTheDocument();
            expect(getByText('kal')).toBeInTheDocument();
            expect(getByText('protein')).toBeInTheDocument();
            expect(getByText('weight')).toBeInTheDocument();
            expect(getByText('sleep')).toBeInTheDocument();
            expect(getByText('water')).toBeInTheDocument();
        });
    });

    it('should render PostFeedSmart component', async () => {
        const trackers = [
            {
                createdAt: '2023-01-01',
                exercise: { caloriesBurned: 500, duration: 60, volume: 100 },
                nutrition: { carb: 300, fat: 70, kal: 2000, protein: 150, weight: 180 },
                sleep: 8,
                water: 64,
            },
        ];
        mockGetTrackers.mockResolvedValue(trackers);

        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={true} />);

        await waitFor(() => {
            expect(getByText('Post to Feed')).toBeInTheDocument();
        });
    });

    it('should show loading state initially', () => {
        const { getByText } = render(<NotiViewerNew userId={1} goalId={1} clicked={false} />);

        expect(getByText('Loading...')).toBeInTheDocument();
    });
});