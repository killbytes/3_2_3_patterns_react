import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '@/components/Modal/Modal';
import {renderWithProviders,} from "@/test/utils";
import userEvent from "@testing-library/user-event";

describe('Modal', () => {
    it('renders children inside modal portal', () => {
        renderWithProviders(
            <Modal onClose={vi.fn()}>
                <h2>Modal title</h2>
                <p>Modal content</p>
            </Modal>);


        const modalRoot = document.getElementById('modal');

        expect(modalRoot).toContainElement(
            screen.getByRole('heading', {
                name: 'Modal title',
            }),
        );

        expect(screen.getByText('Modal content'),).toBeInTheDocument();
    });


    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const onCloseMock  = vi.fn();

        renderWithProviders(
            <Modal onClose={onCloseMock}>
                <p>Modal content</p>
            </Modal>);

        const closeButton = await screen.findByRole('button', {
            name: 'Close modal',
        });
        expect(closeButton).toBeInTheDocument(); // Убедимся, что кнопка найдена

        await user.click(closeButton); // Кликаем по найденной кнопке

        expect(onCloseMock).toHaveBeenCalledTimes(1);

    });

    it('calls onClose when Escape is pressed', async () => {
        const user = userEvent.setup();
        const onCloseMock  = vi.fn();

        renderWithProviders(
            <Modal onClose={onCloseMock}>
                <p>Modal content</p>
            </Modal>);

        await user.keyboard('{Escape}');

        expect(onCloseMock ).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
        const user = userEvent.setup();
        const onCloseMock  = vi.fn();

        renderWithProviders(
            <Modal onClose={onCloseMock}>
                <p>Modal content</p>
            </Modal>);

        const overlay = document.querySelector(
            '[aria-hidden="true"]',
        );

        expect(overlay).toBeInTheDocument();

        await user.click(overlay!);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

});