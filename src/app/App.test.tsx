import {screen, waitFor, within} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {renderWithProviders,} from "@/test/utils";
import App from '@/app/App';

const mockLaunches = [
    {
        flight_number: 1,
        mission_name: 'Trailblazer',
        rocket: {
            rocket_name: 'Falcon 1',
        },
        links: {
            mission_patch_small: 'https://images2.imgbox.com/3d/86/cnu0pan8_o.png',
            mission_patch: 'https://images2.imgbox.com/4b/bd/d8UxLh4q_o.png',
        },
        details: 'Successful Starlink launch',
    },
    {
        flight_number: 2,
        mission_name: 'Crew Dragon In Flight Abort',
        rocket: {
            rocket_name: 'Falcon 9',
        },
        links: {
            mission_patch_small: 'https://example.com/dragon-small.png',
            mission_patch: 'https://example.com/dragon.png',
        },
        details: 'Crew Dragon abort test',
    },
];

describe('App', () => {
    beforeEach(() => {
        vi.stubGlobal(
            'fetch',
            vi.fn(),
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows loader while launches are loading', () => {
        vi.mocked(fetch).mockImplementation(
            () => new Promise(() => {}),
        );
        renderWithProviders(<App/>);
        expect(screen.getByTestId('app-loader')).toBeInTheDocument();
    });

    it('renders launches after successful request', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);
        expect(await screen.findByText('Falcon 9'),).toBeInTheDocument();
        expect(screen.getByText('Crew Dragon In Flight Abort')).toBeInTheDocument();
        expect(screen.getAllByRole('button', {
                name: /seemore/i,
            }),
        ).toHaveLength(2);
    });

    it('renders rocket names', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);
        await screen.findByText('Falcon 1');
        expect(screen.getAllByText('Falcon 9')).toHaveLength(1);
    });

    it('shows error when request fails', async () => {
        vi.mocked(fetch).mockRejectedValue(
            new Error('Network error'),
        );

        renderWithProviders(<App/>);
        expect(await screen.findByText('Failed to load launches: Something went wrong')).toBeInTheDocument();
    });

    it('opens modal after clicking See more and close', async () => {
        const user = userEvent.setup();

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);
        await screen.findByText('Trailblazer');
        const buttons = await screen.findAllByRole('button', {
            name: /seemore/i,
        });

        await user.click(buttons[0]);
        const closeModalButton = await screen.getByLabelText('Close modal');
        expect(closeModalButton).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: /Mission name:/i, level: 5 })).toBeInTheDocument();
        expect(await screen.findByRole('heading', { name: /Rocket name:/i, level: 5 })).toBeInTheDocument();

        await user.click(closeModalButton);
        expect(closeModalButton).not.toBeInTheDocument(); // Модалка должна исчезнуть
    });



    it('shows full mission patch inside modal', async () => {
        const user = userEvent.setup();

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);
        await screen.findByText(mockLaunches[0].mission_name);

        const buttons = await screen.findAllByRole('button', {
            name: /seemore/i,
        });
        await user.click(buttons[0]);

        const modalDialog = await screen.findByRole('dialog');
        expect(modalDialog).toBeInTheDocument();

        const closeModalButton = await screen.getByLabelText('Close modal');

        expect(await within(modalDialog).findByRole('heading', {
            name: /Mission name:/i,
            level: 5
        })).toBeInTheDocument();

        expect(await within(modalDialog).findByText(mockLaunches[0].mission_name)).toBeInTheDocument();
        expect(await within(modalDialog).findByRole('heading', {
            name: /Rocket name:/i,
            level: 5
        })).toBeInTheDocument();
        expect(await within(modalDialog).findByText(mockLaunches[0].rocket.rocket_name)).toBeInTheDocument();

        if (mockLaunches[0].details) {
            expect(await within(modalDialog).findByRole('heading', {
                name: /Details:/i,
                level: 5
            })).toBeInTheDocument();
            expect(await within(modalDialog).findByText(mockLaunches[0].details)).toBeInTheDocument();
        }

        expect(await within(modalDialog).findByAltText(mockLaunches[0].mission_name)).toBeInTheDocument();

        await user.click(closeModalButton);
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('closes modal by pressing Escape', async () => {
        const user = userEvent.setup();

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);

        const buttons = await screen.findAllByRole('button', {
            name: /seemore/i,
        });
        await user.click(buttons[0]);
        expect(screen.getByText('Successful Starlink launch')).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(screen.queryByText('Successful Starlink launch')).not.toBeInTheDocument();
    });

    it('closes modal by clicking overlay', async () => {
        const user = userEvent.setup();

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({
                launches: mockLaunches,
            }),
        } as Response);

        renderWithProviders(<App/>);

        const buttons = await screen.findAllByRole('button', {
            name: /seemore/i,
        });

        await user.click(buttons[0]);
        expect(screen.getByText('Successful Starlink launch')).toBeInTheDocument();
        const overlay = document.querySelector('[aria-hidden="true"]');
        expect(overlay).toBeInTheDocument();
        await user.click(overlay!);
        expect(screen.queryByText('Successful Starlink launch')).not.toBeInTheDocument();
    });
});