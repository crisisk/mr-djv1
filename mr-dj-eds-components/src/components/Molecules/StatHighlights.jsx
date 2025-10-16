import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const defaultStats = [
    {
        label: 'Gemiddelde reviewscore',
        value: '9,8',
        description: 'Op basis van 250+ recensies via ThePerfectWedding, Google en Trustpilot.'
    },
    {
        label: 'Aanvragen binnen 24 uur beantwoord',
        value: '100%',
        description: 'Dedicated planningsteam dat elke lead persoonlijk opvolgt.'
    },
    {
        label: 'Succesvolle evenementen in 2024',
        value: '312',
        description: 'Van intieme bruiloften tot corporate events met 1000+ gasten.'
    }
];

const orientationMap = {
    horizontal: 'grid grid-cols-1 md:grid-cols-3 gap-spacing-lg md:gap-spacing-xl',
    vertical: 'grid grid-cols-1 gap-spacing-lg'
};

const StatHighlights = ({
    title,
    subtitle,
    stats = defaultStats,
    orientation = 'horizontal',
    emphasizeColor = 'text-primary',
    className
}) => {
    const layoutClasses = orientationMap[orientation] || orientationMap.horizontal;

    return (
        <section
            className={clsx(
                'rounded-2xl bg-neutral-light p-spacing-xl shadow-xl border border-neutral-gray-100',
                'flex flex-col gap-spacing-lg',
                className
            )}
        >
            {(title || subtitle) && (
                <div className="space-y-spacing-xs">
                    {title && (
                        <h3 className="text-font-size-h3 font-bold text-neutral-dark">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="text-font-size-body text-neutral-gray-500">{subtitle}</p>
                    )}
                </div>
            )}

            <div className={layoutClasses}>
                {stats.map(({ value, label, description }, index) => (
                    <article
                        key={`${label}-${index}`}
                        className="flex flex-col gap-spacing-sm rounded-xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-lg shadow-sm"
                    >
                        <span className={clsx('text-font-size-h1 font-extrabold tracking-tight', emphasizeColor)}>
                            {value}
                        </span>
                        <span className="text-font-size-h3 font-semibold text-neutral-dark">{label}</span>
                        {description && (
                            <p className="text-font-size-body text-neutral-gray-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
};

StatHighlights.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            description: PropTypes.string
        })
    ),
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    emphasizeColor: PropTypes.string,
    className: PropTypes.string
};

export default StatHighlights;
