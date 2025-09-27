import React from 'react';
import styles from './styles/NumSelector.module.css';


type NumSelectorType = {
    title: string,
    value: number,
    data: number[],
    onChange: (value: number) => void
};
export const NumSelector = ({title, value, data, onChange} : NumSelectorType) => {
    return (
        <div className={styles.selectorContainer}>
            <h3 className={styles.selectorTitle}> {title}</h3>
            <select
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className={styles.selector}
            >
                {data.map((count) => (
                    <option key={count} value={count} className={styles.option}>
                        {count}
                    </option>
                ))}
            </select>
        </div>
    );
};
