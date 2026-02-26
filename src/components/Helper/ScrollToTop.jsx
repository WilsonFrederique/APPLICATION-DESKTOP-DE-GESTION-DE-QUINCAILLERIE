"use client";

import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0, 
            behavior: "smooth",
        });
    };

    return (
        <div className={styles.scrollToTopContainer}>
            {isVisible && (
                <button 
                    onClick={scrollToTop} 
                    className={styles.scrollButton}
                    aria-label="Retour en haut de la page"
                >
                    <FaArrowUp className={styles.arrowIcon} />
                </button>
            )}
        </div>
    )
}

export default ScrollToTop;