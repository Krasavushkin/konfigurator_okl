// components/ExternalLink.tsx
import React from 'react';

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
        <div  className={className}>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
            >
                {children}
            </a>

        </div>

    );
};

