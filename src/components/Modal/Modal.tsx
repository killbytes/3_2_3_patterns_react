import {
    type PropsWithChildren,
    useEffect,
} from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from './Overlay/Overlay';

import styles from './Modal.module.scss';

type ModalProps = PropsWithChildren<{
    onClose: () => void;
}>;

export const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const modalRoot = document.getElementById('modal');

    if (!modalRoot) {
        return null;
    }

    return createPortal(
        <>
            <div className={styles.modal} role="dialog" aria-modal="true">
                <button
                    type="button"
                    className={styles.close}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                {children}
            </div>

            <Overlay onClose={onClose} />
        </>,
        modalRoot,
    );
};