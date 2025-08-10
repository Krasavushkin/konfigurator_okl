import React from 'react';
import styles from './styles/Button.module.css';

type ButtonProps = {
    title: string;
    onClick: () => void;
    disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = React.memo(({ title, onClick, disabled }) => {
    return (
        <button
            className={styles.button}
            disabled={disabled}
            name={title}
            onClick={onClick}
        >
            {title}
        </button>
    );
});
