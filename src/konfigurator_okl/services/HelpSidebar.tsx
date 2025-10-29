// components/HelpSidebar.tsx
import React, { useState } from 'react';
import styles from './HelpSidebar.module.css';

interface Step {
    title: string;
    description: string;
}

const sections = [
    {
        title: "🚀 Быстрый старт",
        content: "Если вы знаете нужную марку ОКЛ — введите её в поиск и нажмите «+ Добавить ОКЛ». Если нет — следуйте пошагово."
    },
    {
        title: "📋 Пошаговая инструкция",
        steps: [
            {
                title: "Выберите тип кабеленесущего элемента",
                description: "Откройте выпадающий список и выберите подходящий вариант (гладкая труба, гофрированная труба, пластиковый кабель-канал и т.д.)"
            },
            {
                title: "Задайте поверхность монтажа",
                description: "Выберите тип поверхности, список изменяется в зависимости от выбранного кабеленесущего элемента."
            },
            {
                title: "Выберите крепёжный элемент",
                description: "Подходящий крепёж также изменяется в зависимости от предыдущего выбора."
            },
            {
                title: "Выберите ОКЛ",
                description: "Выберите подходящую огнестойкую кабельную линию из доступных вариантов."
            },
            {
                title: "Добавьте ОКЛ",
                description: "Укажите длину в метрах и нажмите кнопку '+ Добавить ОКЛ'"
            },
            {
                title: "Выберите назначение кабеля",
                description: "Можете воспользоваться фильтром, выбрав назначение кабеля, а можете сразу перейти к следующему шагу"
            },
            {
                title: "Добавьте кабель в ОКЛ",
                description: "Выберите кабель из доступных вариантов, если использовали фильтр, или же воспользуйтейсь поиском. Введя в строку известную вам информацию (сечение кабеля, количество жил и т.д.), вы можете ускорить выбор нужной марки. " +
                    "После выбора кабеля, укажите длину в метрах и нажмите кнопку '+ Добавить кабель в ОКЛ'."
            }
        ] as Step[]
    },
    {
        title: "🔧 Работа с конфигуратором",
        content: `После нажатия кнопки "+ Добавить ОКЛ", карточка ОКЛ становится автоматически выбранной.

• Внизу раздела "Подбор кабеля для ОКЛ" появляется информация о заполненности ОКЛ кабелем. Заполненность считается автоматически.
• Также возможно взаимодействие с уже добавленными карточками ОКЛ — просто кликните на нужную.

С карточками ОКЛ возможны следующие взаимодействия:
• Дублировать или удалять ОКЛ
• Добавить кабель
• Удалять отдельные кабели из выбранной ОКЛ
• При нажатии кнопки "Подробнее" в новой вкладке откроется информация о выбранной ОКЛ`
    },
    {
        title: "💾 Сохранение",
        content: `Кнопка «Сохранить в PDF» — скачает Ваш проект.

В документы войдёт:
• Все добавленные ОКЛ
• Кабели с длинами
• Описание выбранных ОКЛ`
    },
    {
        title: "💡 Советы",
        content: `• В проект можно добавить нужное вам количество ОКЛ
• Выбор ОКЛ или нужной марки кабеля можно осуществлять через поля поиска
• Карточка ОКЛ автоматически выделяется при добавлении

Совет: используйте поиск — это быстрее!`
    }
];

export const HelpSidebar = () => {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(0);

    return (
        <>
            {/* КНОПКА ПОМОЩИ */}
            <button
                className={`${styles.helpBtn} ${open ? styles.hidden : ''}`}
                onClick={() => setOpen(true)}
                title="Открыть инструкцию"
            >
                ?
            </button>

            {/* САЙДБАР */}
            <div className={`${styles.sidebar} ${open ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Инструкция</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setOpen(false)}
                    >
                        X
                    </button>
                </div>

                <nav className={styles.nav}>
                    {sections.map((s, i) => (
                        <button
                            key={i}
                            className={`${styles.navBtn} ${activeSection === i ? styles.active : ''}`}
                            onClick={() => setActiveSection(i)}
                        >
                            {s.title.split(' ')[0]}
                        </button>
                    ))}
                </nav>

                <div className={styles.content}>
                    {/* Быстрый старт */}
                    {activeSection === 0 && (
                        <div className={styles.section}>
                            <h3>{sections[0].title}</h3>
                            <p>{sections[0].content}</p>
                            <button
                                className={styles.actionBtn}
                                onClick={() => setActiveSection(1)}
                            >
                                Пошаговая инструкция
                            </button>
                        </div>
                    )}

                    {/* Пошагово */}
                    {activeSection === 1 && (
                        <div className={styles.section}>
                            <h3>{sections[1].title}</h3>
                            <div className={styles.steps}>
                                {sections[1].steps!.map((step, i) => (
                                    <div key={i} className={styles.step}>
                                        <div className={styles.stepHeader}>
                                            <span className={styles.stepNumber}>{i + 1}</span>
                                            <h4>{step.title}</h4>
                                        </div>
                                        <p>{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Остальные */}
                    {[2, 3, 4].includes(activeSection) && (
                        <div className={styles.section}>
                            <h3>{sections[activeSection].title}</h3>
                            <p>{sections[activeSection].content}</p>
                        </div>
                    )}
                </div>

                <div className={styles.mobileProgress}>
                    {sections.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${activeSection === i ? styles.active : ''}`}
                            onClick={() => setActiveSection(i)}
                        />
                    ))}
                </div>
            </div>

            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
        </>
    );
};