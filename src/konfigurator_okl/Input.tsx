import React, { ChangeEvent } from 'react';
import styles from './styles/Input.module.css';
interface InputProps {
    title: string;
    value: number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'password' | 'email' | 'number';
    className?: string;
    disabled?: boolean;
    size?: 'default' | 'small' | 'large';
    error?: boolean;
}

export const Input: React.FC<InputProps> = ({
                                                title,
                                                value,
                                                onChange,
                                                placeholder = '',
                                                type = 'text',
                                                className = '',
                                                disabled = false,
                                                size = 'default',
                                                error = false,
                                            }) => {
    const sizeClass = {
        'small': styles.small,
        'large': styles.large,
        'default': ''
    }[size];
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <h3> {title}</h3>
            <input
                type={"number"}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={`
        ${styles.input} 
        ${sizeClass} 
        ${error ? styles.error : ''} 
        ${className}
      `}
                disabled={disabled}
            />
        </div>

    );
};