import React, { useState } from "react";
import styles from "./OnboardingSidebar.module.css";

export const OnboardingSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Кнопка вопроса — всегда на экране */}
            {!open && (
                <button className={styles.helpBtn} onClick={() => setOpen(true)}>
                    ?
                </button>
            )}

            {/* Выезжающий сайдбар */}
            <div className={`${styles.sidebar} ${open ? styles.open : ""}`}>
                <div className={styles.container}>
                    <h2 className={styles.h2}>Инструкция</h2>
                    <button className={styles.closeBtn} onClick={() => setOpen(false)}>
                        ✕
                    </button>
                </div>
                <p> Вы можете выбрать ОКЛ в несколько простых шагов</p>
                <ol>
                    <li>Выберите подвес.</li>
                    <li>Задайте поверхность.</li>
                    <li>Добавьте крепёж.</li>
                    <li>Соберите ОКЛ и сохраните.</li>
                </ol>
                <p> Либо можете воспользоваться поиском и выбрать нужную ОКЛ и кабели
                    для нее без использования фильтров</p>
            </div>
        </>
    );
};
