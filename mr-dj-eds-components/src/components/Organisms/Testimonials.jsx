import React from 'react';

const testimonialsData = [
    {
        quote: "De combinatie van DJ en Saxofonist was het hoogtepunt van onze bruiloft. De sfeer was onvergetelijk!",
        author: "Jan & Marieke",
        source: "Bruiloft, Amsterdam",
        rating: 5,
    },
    {
        quote: "Professioneel, energiek en ze wisten precies de juiste snaar te raken. Een absolute aanrader voor elk bedrijfsfeest.",
        author: "Suzanne van Dijk",
        source: "Bedrijfsfeest, Utrecht",
        rating: 5,
    },
    {
        quote: "De muziek was perfect afgestemd op onze gasten. De saxofonist maakte het helemaal af!",
        author: "Mark de Vries",
        source: "Verjaardagsfeest, Eindhoven",
        rating: 5,
    },
];

const StarRating = ({ rating }) => {
    const stars = Array(5).fill(0).map((_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-secondary' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    ));
    return <div className="flex">{stars}</div>;
};

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col h-full">
            <StarRating rating={testimonial.rating} />
            <p className="text-2xl text-[#1A2C4B] italic my-spacing-lg flex-grow">
                "{testimonial.quote}"
            </p>
            <div className="border-t border-gray-100 pt-4">
                <p className="text-base font-bold text-primary">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.source}</p>
            </div>
        </div>
    );
};

const Testimonials = () => {
    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl text-center text-[#1A2C4B] mb-12 font-extrabold">
                    Wat Klanten Zeggen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
