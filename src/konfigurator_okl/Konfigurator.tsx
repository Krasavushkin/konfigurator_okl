import React from 'react';

export const Konfigurator = () => {
    return (
        <div>
            <aside className="filters-sidebar">
                <h2>Фильтры</h2>

                <div className="filter-section">
                    <h3>Тип ОКЛ</h3>

                </div>

                <div className="filter-section">
                    <h3>Длина (м)</h3>

                </div>

                <div className="filter-actions">
                    <button >Сбросить всё</button>
                    <button >Применить</button>
                </div>
            </aside>
        </div>
    );
};
