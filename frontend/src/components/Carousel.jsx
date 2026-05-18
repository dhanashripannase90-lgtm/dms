import React, { useState, useEffect } from "react";

const Carousel = ({ slides }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="carousel-container glass-panel">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`carousel-slide ${index === current ? "active" : ""}`}
                >
                    {slide.image && (
                        <img src={slide.image} alt={slide.title} className="carousel-image" />
                    )}
                    <div className="carousel-overlay" />
                    <div className="carousel-content">
                        <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1.5px" }}>
                            {slide.title}
                        </h2>
                        <p style={{ fontSize: "1.15rem", marginBottom: "2rem" }}>
                            {slide.description}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            {slide.actions}
                        </div>
                    </div>
                </div>
            ))}
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`carousel-dot ${index === current ? "active" : ""}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
