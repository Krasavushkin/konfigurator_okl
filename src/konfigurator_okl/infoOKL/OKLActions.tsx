import React from 'react';
import styles from '../styles/OKL.module.css';

interface OKLActionsProps {
    oklId: string;
    isSelected: boolean;

    onDelete: (oklId: string) => void;
    onCopy: (oklId: string) => void;
}

export const OKLActions: React.FC<OKLActionsProps> = ({
                                                          oklId,
                                                          isSelected,
                                                          onDelete,
                                                          onCopy
                                                      }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить эту ОКЛ?')) {
            onDelete(oklId);
        }
    };
 /*   const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(oklId);
    };*/
    return (
        <div className={styles.oklActions}>
           {/* <button
                className={styles.actionBtn}
                onClick={handleCopy}
                title="Дублировать ОКЛ"
            ><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>

            </button>*/}
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