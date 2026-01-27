import React from 'react';
import styles from '../styles/CounterBadge.module.css';

interface CounterBadgeProps {
    label: string;
    value: number;
    max?: number;
    icon?: React.ReactNode;
    highlight?: boolean;
    color?: 'default' | 'success' | 'warning' | 'error';
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({
                                                              label,
                                                              value,
                                                              max,
                                                              icon,
                                                              highlight = false,
                                                              color = 'default'
                                                          }) => {
    const percentage = max ? Math.min((value / max) * 100, 100) : 0;

    return (
        <div className={`${styles.counter} ${highlight ? styles.highlight : ''}`}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{label}:</span>
            <span
                className={`${styles.value} ${styles[color]} ${highlight ? styles.pulse : ''}`}
                style={max ? {'--progress': `${percentage}%`} as React.CSSProperties : undefined}
            >
        {max ? `${value}/${max}` : value}
            </span>
        </div>
    );
};