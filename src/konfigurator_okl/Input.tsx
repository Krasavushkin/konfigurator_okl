import React, { ChangeEvent } from 'react';
import styles from './styles/Input.module.css';

interface InputProps {
    title: string;
    value: number;
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
        'small': styles.small,
        'large': styles.large,
        'default': ''
    }[size];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Разрешаем только цифры и точку
        if (!/^\d*\.?\d*$/.test(inputValue)) {
            return;
        }

        onChange(inputValue);
    };

    const handleBlur = () => {
        // При потере фокуса проверяем и нормализуем
        if (value < min) {
            onChange(min.toString());
        }
    };

    return (
        <div className={styles.inputContainer}>
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
                    ${error ? styles.error : ''} 
                    ${className}
                `}
                disabled={disabled}
            />
            {error && value < min && (
                <div className={styles.errorMessage}>
                    Значение не может быть меньше {min}
                </div>
            )}
        </div>
    );
};