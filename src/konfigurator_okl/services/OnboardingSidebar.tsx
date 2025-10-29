// components/OnboardingSidebar.tsx
import React, { useState } from "react";
import styles from "../styles/OnboardingSidebar.module.css";

interface Step {
    title: string;
    description: string;
    optional?: boolean;
}

export const OnboardingSidebar = () => {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<number>(0);

    const sections = [
        {
            title: "🚀 Быстрый старт",
            content: "Если вы знаете нужную марку ОКЛ, просто введите её название в поле поиска и нажмите кнопку '+ Добавить ОКЛ', после перейдите к добавлению кабеля в ОКЛ. " +
                "Если нет - следуйте пошаговой инструкции ниже."
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
            title: "🔧 Работа с ОКЛ",
            content: "После нажатия кнопки '+ Добавить ОКЛ', карточка ОКЛ становится автоматически выбранной. Внизу раздела 'Подбор кабеля для ОКЛ' появляется информация о заполненности ОКЛ кабелем. Заполненность считается автоматически. " +
                "Также возможно взаимодействие с уже добавленными карточками ОКЛ, просто кликните на нужную вам. " +
                "С карточками ОКЛ возможны следующие взаимодействия: " +
                "\n• Дублировать или удалять ОКЛ\n• Добавить кабель \n• Удалять отдельные кабели из выбранной ОКЛ\n• При нажатии кнопки 'Подробнее' в новой вкладке откроется информация о выбранной ОКЛ "
        },
        {
            title: "💾 Сохранение",
            content: "Используйте кнопку 'Сохранить в PDF' для сохранения проекта с добавленными ОКЛ."
        },
        {
            title: "💡 Советы",
            content: "• В проект можно добавить нужное вам количество ОКЛ\n• Выбор ОКЛ или нужной марки кабеля можно осуществлять через поля поиска\n• Карточка ОКЛ выделяется при выборе и добавлении."
        }
    ];

    return (
        <>
            {/* Кнопка помощи */}
            <button
                className={`${styles.helpBtn} ${open ? styles.hidden : ''}`}
                onClick={() => setOpen(true)}
                title="Открыть инструкцию"
            >
                ?
            </button>

            {/* Сайдбар */}
            <div className={`${styles.sidebar} ${open ? styles.open : ''}`}>
                {/* Заголовок */}
                <div className={styles.header}>
                    <h2 className={styles.title}>📖 Инструкция по работе с конфигуратором ОКЛ</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setOpen(false)}
                        title="Закрыть инструкцию"
                    >
                        ✕
                    </button>
                </div>

                {/* Навигация по разделам */}
                <nav className={styles.nav}>
                    {sections.map((section, index) => (
                        <button
                            key={index}
                            className={`${styles.navBtn} ${activeSection === index ? styles.active : ''}`}
                            onClick={() => setActiveSection(index)}
                        >
                            {section.title.split(' ')[0]} {/* Иконка */}
                        </button>
                    ))}
                </nav>

                {/* Контент */}
                <div className={styles.content}>
                    {/* Быстрый старт */}
                    {activeSection === 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>{sections[0].title}</h3>
                            <p className={styles.text}>{sections[0].content}</p>
                            <div className={styles.quickActions}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => setActiveSection(1)}
                                >
                                    📋 Показать пошаговую инструкцию
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Пошаговая инструкция */}
                    {activeSection === 1 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>{sections[1].title}</h3>
                            <div className={styles.steps}>
                                {sections[1].steps!.map((step, index) => (
                                    <div key={index} className={styles.step}>
                                        <div className={styles.stepHeader}>
                                            <span className={styles.stepNumber}>{index + 1}</span>
                                            <h4 className={styles.stepTitle}>{step.title}</h4>
                                        </div>
                                        <p className={styles.stepDescription}>{step.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Остальные разделы */}
                    {[2, 3, 4].includes(activeSection) && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>{sections[activeSection].title}</h3>
                            <p className={styles.text}>{sections[activeSection].content}</p>
                        </div>
                    )}
                </div>

                {/* Прогресс для мобильных */}
                <div className={styles.mobileProgress}>
                    {sections.map((_, index) => (
                        <div
                            key={index}
                            className={`${styles.progressDot} ${activeSection === index ? styles.active : ''}`}
                            onClick={() => setActiveSection(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Overlay */}
            {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
        </>
    );
};