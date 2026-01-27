import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './styles/Dropdown.module.css';

type Item = { id: string; name: string };

interface DropdownProps {
    id?: string
    title: string;
    items: Item[];
    selectedId: string | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (id: string) => void;
    disabled?: boolean;
    searchable?: boolean; // Новое свойство для включения поиска
    placeholder?: string; // Плейсхолдер для поиска
}


export const Dropdown: React.FC<DropdownProps> = ({
                                                      title,
                                                      items,
                                                      selectedId,
                                                      isOpen,
                                                      onToggle,
                                                      onSelect,
                                                      disabled = false,
                                                      searchable = false,
                                                      placeholder = "Поиск..."
                                                  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Функции нормализации
    const normalizeSearchTerm = (term: string): string => {
        return term
            .toLowerCase()
            .trim()
            .replace(/\./g, ',')
            .replace(/[xх]/g, 'х')
            .replace(/[aа]/g, 'а')
            .replace(/[eе]/g, 'е')
            .replace(/[oо]/g, 'о')
            .replace(/[pр]/g, 'р')
            .replace(/[cс]/g, 'с')
            .replace(/[yу]/g, 'у');
    };

    const normalizeItemName = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/\./g, ',')
            .replace(/[xх]/g, 'х')
            .replace(/[aа]/g, 'а')
            .replace(/[eе]/g, 'е')
            .replace(/[oо]/g, 'о')
            .replace(/[pр]/g, 'р')
            .replace(/[cс]/g, 'с')
            .replace(/[yу]/g, 'у');
    };

    const selectedName = items.find(item => item.id === selectedId)?.name || "не выбрано";

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.trimStart();
        value = value.replace(/\s{2,}/g, ' ');
        setSearchTerm(value);
    };

    const filteredItems = useMemo(() => {
        if (!searchable || !searchTerm.trim()) return items;

        const normalizedSearch = normalizeSearchTerm(searchTerm);

        return items.filter(item => {
            const normalizedItemName = normalizeItemName(item.name);
            return normalizedItemName.includes(normalizedSearch);
        });
    }, [items, searchTerm, searchable]);

    const handleItemSelect = (id: string) => {
        onSelect(id);
        setSearchTerm('');
    };

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
                    {searchable && (
                        <div className={styles.searchContainer}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div
                                key={item.id}
                                className={`${styles.dropdownItem} ${item.id === selectedId ? styles.selected : ''}`}
                                onClick={() => handleItemSelect(item.id)}
                            >
                                {item.name}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            {searchTerm ? 'Ничего не найдено' : 'Нет доступных вариантов'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


