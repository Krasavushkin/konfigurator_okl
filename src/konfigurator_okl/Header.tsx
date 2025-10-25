// components/Header.tsx
import React from 'react';
import styles from './Header.module.css';
import logo from '../logo.png'; // Путь к вашему логотипу

// Header с акцентной полосой
export const Header = () => {
    return (
        <header className={styles.header}>
            {/* Акцентная полоса */}
            <div className={styles.accentStrip}></div>

            <div className={styles.container}>
                <a
                    href="https://spetskabel.ru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.logoSection}
                >
                    <img
                        src={logo}
                        alt="СПЕЦКАБЕЛЬ"
                        className={styles.logoImg}
                    />
                    <div className={styles.logoText}>
                        <span className={styles.companyLine}>Кабельный завод</span>
                        <span className={styles.brandName}>СПЕЦКАБЕЛЬ</span>
                    </div>
                </a>

                <div className={styles.title}>
                    <h1>Конфигуратор ОКЛ</h1>
                    <p>Огнестойкие кабельные линии</p>
                </div>

                <div className={styles.badge}>
                    <span>v1.0</span>
                </div>
            </div>
        </header>
    );
};