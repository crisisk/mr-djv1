import{j as e}from"./index-CcapKUPA.js";import{a as m,H as p,b as j,F as g}from"./Footer-D0KTytcb.js";import{C as u}from"./ContactForm-DtQscSio.js";const N=({data:s,pricingSection:i,testimonialsSection:l,variant:a})=>{if(!s)return e.jsx("div",{children:"Geen lokale SEO data gevonden."});const{city:t,province:r,localUSP:n,localReviews:f,localVenues:o,seoTitle:c,seoDescription:d}=s;return e.jsxs("div",{className:"LocalSeoPage",children:[e.jsx(m,{}),e.jsxs(p,{children:[e.jsx("title",{children:c}),e.jsx("meta",{name:"description",content:d}),e.jsx("script",{type:"application/ld+json",children:`
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
                                "addressRegion": "${r}",
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
                                    "addressRegion": "${r}",
                                    "addressCountry": "NL"
                                }
                            },
                            "description": "${n}",
                            "organizer": {
                                "@type": "Organization",
                                "name": "Mr. DJ",
                                "url": "https://www.mrdj.nl"
                            }
                        }
                    `})]}),e.jsx(j,{title:`Uw DJ voor Feesten in ${t}, ${r}`,subtitle:n,ctaPrimaryText:"Check Beschikbaarheid",ctaSecondaryText:"Vraag Offerte Aan",backgroundClass:"bg-primary",titleColor:"text-white",subtitleColor:"text-white"}),e.jsx("section",{className:"py-12 bg-white",children:e.jsxs("div",{className:"container mx-auto px-4 text-center",children:[e.jsxs("h2",{className:"text-4xl font-bold text-[#1A2C4B] mb-6",children:["Bekend met de beste locaties in ",t," en ",r]}),e.jsx("div",{className:"flex justify-center space-x-6",children:o.map((x,h)=>e.jsx("span",{className:"bg-gray-100 text-[#1A2C4B] px-4 py-2 rounded-full text-base shadow-sm",children:x},h))})]})}),e.jsx("section",{className:"py-16 bg-gray-100",children:e.jsxs("div",{className:"container mx-auto px-4",children:[e.jsxs("h2",{className:"text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold",children:["Wat klanten in ",t," en ",r," zeggen"]}),l]})}),i,e.jsx("section",{className:"py-12 bg-white",children:e.jsxs("div",{className:"container mx-auto px-4 text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-[#1A2C4B] mb-6",children:"Ontdek Onze DJ Services in de Regio"}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-4",children:[e.jsx("a",{href:"/dj-in-tilburg",className:"text-primary-500 hover:text-primary-700 underline",children:"DJ in Tilburg"}),e.jsx("a",{href:"/dj-in-breda",className:"text-primary-500 hover:text-primary-700 underline",children:"DJ in Breda"}),e.jsx("a",{href:"/bruiloft-dj-eindhoven",className:"text-primary-500 hover:text-primary-700 underline",children:"Bruiloft DJ in Eindhoven"}),e.jsx("a",{href:"/bruiloft-dj-maastricht",className:"text-primary-500 hover:text-primary-700 underline",children:"Bruiloft DJ in Maastricht"}),s.slug.startsWith("bruiloft-dj-")?e.jsxs("a",{href:`/dj-in-${s.slug.replace("bruiloft-dj-","")}`,className:"text-primary-500 hover:text-primary-700 underline",children:["Algemene DJ Service in ",t]}):e.jsxs("a",{href:`/bruiloft-dj-${s.slug}`,className:"text-primary-500 hover:text-primary-700 underline",children:["Bruiloft DJ Service in ",t]})]})]})}),e.jsx("section",{className:"py-16 bg-white",children:e.jsx("div",{className:"container mx-auto px-4 max-w-3xl",children:e.jsx(u,{variant:a,eventType:s.slug.startsWith("bruiloft-dj-")?"bruiloft":""})})}),e.jsxs("div",{className:"bg-[#1A2C4B] text-white py-12 text-center",children:[e.jsx("h3",{className:"text-4xl font-bold mb-4",children:a==="B"?`Vraag vandaag nog een gratis offerte aan in ${t}!`:`Klaar voor een onvergetelijk feest in ${t} of ${r}?`}),e.jsxs("p",{className:"text-white mb-4",children:["Bel ons direct op ",e.jsx("a",{href:"tel:+31408422594",className:"font-bold underline hover:text-secondary",children:"+31 (0) 40 8422594"})]})]}),e.jsx(g,{})]})};export{N as default};
