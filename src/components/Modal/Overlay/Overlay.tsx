import styles from './Overlay.module.scss';

type OverlayProps = {
    onClose: () => void;
};

export const Overlay = ({ onClose }: OverlayProps) => {
    return (
        <div
            className={styles.overlay}
            onClick={onClose}
            aria-hidden="true"
        />
    );
};