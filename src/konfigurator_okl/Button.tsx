import React from 'react';
import styles from './styles/Button.module.css';

type ButtonProps = {
    title: string;
    onClick: () => void;
    disabled?: boolean;
};


export const Button: React.FC<ButtonProps> = ({ title, onClick, disabled }) => {
    const isDelete = title.includes('Удалить') ;
    const isPDF = title.includes('PDF');
    const isAddCable = title.includes('кабель') || title.includes('Добавить');
    const isExcel = title.includes('Excel');

    return (
        <button
            className={`${styles.button} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {/* PDF */}
            {isPDF && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
            )}
            {/* Excel */}
            {isExcel && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {/* Фон */}
                    <rect x="3" y="3" width="18" height="18" rx="2" fill="#217346"/>
                    {/* Буква X */}
                    <path d="M15 9L12 12L15 15M9 9L12 12L9 15"
                          stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    {/* Лист */}
                    <rect x="6" y="6" width="12" height="12" rx="1" fill="none" stroke="white" strokeWidth="1"/>
                </svg>
            )}
            {/* Удалить */}
            {isDelete && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18l-2 13H5L3 6z"/>
                    <path d="M10 9v6m4-6v6m-7-8h10"/>
                </svg>
            )}

            {/* Добавить кабель */}
            {isAddCable && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2v20m-10-10h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
            )}

            <span>{title}</span>
        </button>
    );
};