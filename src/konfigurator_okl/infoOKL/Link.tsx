import React from 'react';
import styles from '../styles/Link.module.css';

interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Link: React.FC<LinkProps> = ({
                                              href,
                                              children,
                                              className = '',
                                              title
                                          }) => {
    return (
        <a
            href={href}
            className={`${styles.link} ${className}`}
            title={title}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span>{children}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </a>
    );
};