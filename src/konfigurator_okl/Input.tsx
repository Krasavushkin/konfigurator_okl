import React, { ChangeEvent } from 'react';
import styles from './styles/Input.module.css';

interface InputProps {
    title: string;
    value: number | string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    size?: 'default' | 'small' | 'large';
    error?: boolean;
    min?: number;
}

export const Input: React.FC<InputProps> = ({
                                                title,
                                                value,
                                                onChange,
                                                placeholder = '',
                                                className = '',
                                                disabled = false,
                                                size = 'default',
                                                error = false,
                                                min = 1,
                                            }) => {
    const sizeClass = {
        small: styles.small,
        large: styles.large,
        default: ''
    }[size];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (!/^\d*\.?\d*$/.test(inputValue)) return;

        onChange(inputValue);
    };

    const handleBlur = () => {
        const numValue = parseFloat(value.toString()) || 0;
        if (numValue < min) {
            onChange(min.toString());
        }
    };

    const isError = error || (value !== '' && parseFloat(value.toString()) < min);

    return (
        <div className={`${styles.inputContainer} ${className}`}>
            <h3 className={styles.title}>{title}</h3>
            <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`
                    ${styles.input}
                    ${sizeClass}
                    ${isError ? styles.error : ''}
                `.trim()}
                disabled={disabled}
            />
            {isError && (
                <div className={styles.errorMessage}>
                    Значение не может быть меньше {min}
                </div>
            )}
        </div>
    );
};