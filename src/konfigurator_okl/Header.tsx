import React from 'react';
import styles from "./styles/Konfigurator.module.css";

export const Header = () => {
    return (
        <header className={styles.headerContainer}> {/* Используем semantic HTML */}
            <div className={styles.headerLogo}>
                <a
                    href="https://spetskabel.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.headerLogo}
                    aria-label="Перейти на основной сайт СПЕЦКАБЕЛЬ"
                >
                    <h2 className={styles.headerLogo}>Кабельный завод <br/>СПЕЦКАБЕЛЬ</h2>
                </a>
            </div>
            <h1 className={styles.headerTitle}>Конфигуратор ОКЛ</h1>
        </header>
    );
};
