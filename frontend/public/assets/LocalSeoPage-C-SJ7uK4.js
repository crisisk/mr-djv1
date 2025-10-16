import{j as e}from"./index-Bl6IZbbJ.js";import{a as m,H as h,b as g,C as u,F as j}from"./Footer-C32QXgk1.js";const b=({data:s,pricingSection:i,testimonialsSection:l,variant:n})=>{if(!s)return e.jsx("div",{children:"Geen lokale SEO data gevonden."});const{city:t,province:a,localUSP:r,localReviews:f,localVenues:c,seoTitle:o,seoDescription:d}=s;return e.jsxs("div",{className:"LocalSeoPage",children:[e.jsx(m,{}),e.jsxs(h,{children:[e.jsx("title",{children:o}),e.jsx("meta",{name:"description",content:d}),e.jsx("script",{type:"application/ld+json",children:`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "Mr. DJ - Uw DJ in ${t}",
                            "image": "https://www.mrdj.nl/logo.png",
                            "url": "https://www.mrdj.nl/dj-in-${s.slug}",
                            "telephone": "+31850601234",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "${t}",
                                "addressRegion": "${a}",
                                "addressCountry": "NL"
                            },
                            "priceRange": "€€€",
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.9",
                                "reviewCount": "250"
                            },
                            "servesCuisine": "Muziek",
                            "hasMap": "https://www.google.com/maps/search/${t}+DJ"
                        }
                    `}),e.jsx("script",{type:"application/ld+json",children:`
                        {
                            "@context": "https://schema.org",
                            "@type": "Event",
                            "name": "Feest met DJ in ${t}",
                            "startDate": "2025-12-31T20:00",
                            "endDate": "2026-01-01T04:00",
                            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                            "eventStatus": "https://schema.org/EventScheduled",
                            "location": {
                                "@type": "Place",
                                "name": "Diverse Locaties in ${t}",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "${t}",
                                    "addressRegion": "${a}",
                                    "addressCountry": "NL"
                                }
                            },
                            "description": "${r}",
                            "organizer": {
                                "@type": "Organization",
                                "name": "Mr. DJ",
                                "url": "https://www.mrdj.nl"
                            }
                        }
                    `})]}),e.jsx(g,{title:`Uw DJ voor Feesten in ${t}, ${a}`,subtitle:r,ctaPrimaryText:"Check Beschikbaarheid",ctaSecondaryText:"Vraag Offerte Aan",backgroundClass:"bg-primary",titleColor:"text-neutral-light",subtitleColor:"text-neutral-light"}),e.jsx("section",{className:"py-spacing-2xl bg-neutral-light",children:e.jsxs("div",{className:"container mx-auto px-spacing-md text-center",children:[e.jsxs("h2",{className:"text-font-size-h2 font-bold text-neutral-dark mb-spacing-lg",children:["Bekend met de beste locaties in ",t," en ",a]}),e.jsx("div",{className:"flex justify-center space-x-spacing-lg",children:c.map((x,p)=>e.jsx("span",{className:"bg-neutral-gray-100 text-neutral-dark px-spacing-md py-spacing-sm rounded-full text-font-size-body shadow-sm",children:x},p))})]})}),e.jsx("section",{className:"py-spacing-3xl bg-neutral-gray-100",children:e.jsxs("div",{className:"container mx-auto px-spacing-md",children:[e.jsxs("h2",{className:"text-font-size-h2 text-center text-neutral-dark mb-spacing-lg font-extrabold",children:["Wat klanten in ",t," en ",a," zeggen"]}),l]})}),i,e.jsx("section",{className:"py-spacing-2xl bg-neutral-light",children:e.jsxs("div",{className:"container mx-auto px-spacing-md text-center",children:[e.jsx("h2",{className:"text-font-size-h3 font-bold text-neutral-dark mb-spacing-lg",children:"Ontdek Onze DJ Services in de Regio"}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-spacing-md",children:[e.jsx("a",{href:"/dj-in-tilburg",className:"text-primary-500 hover:text-primary-700 underline",children:"DJ in Tilburg"}),e.jsx("a",{href:"/dj-in-breda",className:"text-primary-500 hover:text-primary-700 underline",children:"DJ in Breda"}),e.jsx("a",{href:"/bruiloft-dj-eindhoven",className:"text-primary-500 hover:text-primary-700 underline",children:"Bruiloft DJ in Eindhoven"}),e.jsx("a",{href:"/bruiloft-dj-maastricht",className:"text-primary-500 hover:text-primary-700 underline",children:"Bruiloft DJ in Maastricht"}),s.slug.startsWith("bruiloft-dj-")?e.jsxs("a",{href:`/dj-in-${s.slug.replace("bruiloft-dj-","")}`,className:"text-primary-500 hover:text-primary-700 underline",children:["Algemene DJ Service in ",t]}):e.jsxs("a",{href:`/bruiloft-dj-${s.slug}`,className:"text-primary-500 hover:text-primary-700 underline",children:["Bruiloft DJ Service in ",t]})]})]})}),e.jsx("section",{className:"py-spacing-3xl bg-neutral-light",children:e.jsx("div",{className:"container mx-auto px-spacing-md max-w-3xl",children:e.jsx(u,{variant:n,eventType:s.slug.startsWith("bruiloft-dj-")?"bruiloft":""})})}),e.jsxs("div",{className:"bg-neutral-dark text-neutral-light py-spacing-2xl text-center",children:[e.jsx("h3",{className:"text-font-size-h2 font-bold mb-spacing-md",children:n==="B"?`Vraag vandaag nog een gratis offerte aan in ${t}!`:`Klaar voor een onvergetelijk feest in ${t} of ${a}?`}),e.jsxs("p",{className:"text-neutral-light mb-spacing-md",children:["Bel ons direct op ",e.jsx("a",{href:"tel:+31408422594",className:"font-bold underline hover:text-secondary",children:"+31 (0) 40 8422594"})]})]}),e.jsx(j,{})]})};export{b as default};
