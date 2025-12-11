// components/Header.tsx
import React from 'react';
import styles from './styles/Header.module.css';
import logo from '../MainLogo.jpg'; // Путь к вашему логотипу

// Header с акцентной полосой
export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.accentStrip} />

            <div className={styles.container}>
                {/* ЛОГО */}
                <a
                    href="https://spetskabel.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.logoSection}
                >
                    <img src={logo} alt="СПЕЦКАБЕЛЬ" className={styles.logoImg} />

                </a>

                {/* ЗАГОЛОВОК */}
                <div className={styles.title}>
                    <h1>Конфигуратор ОКЛ</h1>
                    <p>Огнестойкие кабельные линии</p>
                </div>

                {/* БЕЙДЖ */}
                <div className={styles.badge}>
                    v 1.0
                </div>
            </div>
        </header>
    );
};