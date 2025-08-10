import React from 'react';
import styles from './styles/Dropdown.module.css';

type Item = { id: string; name: string };

export const Dropdown = ({
                             title,
                             items,
                             selectedId,
                             isOpen,
                             onToggle,
                             onSelect,
                             disabled
                         }: {
    title: string;
    items: Item[];
    selectedId: string;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (id: string, name: string) => void;
    disabled?: boolean;
}) => {
    const selectedName = items.find(item => item.id === selectedId)?.name ||"не выбрано";

    return (
        <div className={`${styles.dropdown} ${disabled ? styles.disabled : ''}`}>
            <h3 className={styles.title}>{title}</h3>

            <div
                className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''}`}
                onClick={!disabled ? onToggle : undefined}
            >
                <span>{selectedName}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className={styles.dropdownList}>
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`${styles.dropdownItem} ${item.id === selectedId ? styles.selected : ''}`}
                            onClick={() => onSelect(item.id, item.name)}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
