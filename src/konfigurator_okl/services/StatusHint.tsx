import React from 'react';
import styles from '../styles/StatusHint.module.css';

type HintType = 'info' | 'success' | 'warning' | 'error';

interface StatusHintProps {
    type?: HintType;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const StatusHint: React.FC<StatusHintProps> = ({
                                                          type = 'info',
                                                          icon,
                                                          children,
                                                          className = ''
                                                      }) => {
    const defaultIcons = {
        info: 'i',
        success: '✓',
        warning: '!',
        error: 'X'
    };

    return (
        <div className={`${styles.hint} ${styles[type]} ${className}`}>
            <div className={styles.message}>
        <span className={styles.icon}>
          {icon || defaultIcons[type]}
        </span>
                <span className={styles.text}>{children}</span>
            </div>
        </div>
    );
};