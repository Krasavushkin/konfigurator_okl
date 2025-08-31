import React from 'react';
import styles from '../styles/OKL.module.css';

interface OKLActionsProps {
    oklId: string;
    isSelected: boolean;
    onEdit: (oklId: string) => void;
    onDelete: (oklId: string) => void;
}

export const OKLActions: React.FC<OKLActionsProps> = ({
                                                          oklId,
                                                          isSelected,
                                                          onEdit,
                                                          onDelete
                                                      }) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(oklId);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить эту ОКЛ?')) {
            onDelete(oklId);
        }
    };

    return (
        <div className={styles.oklActions}>
            <button
                className={styles.removeBtn}
                onClick={handleDelete}
                title="Удалить ОКЛ"
            >
                ✕
            </button>
        </div>
    );
};