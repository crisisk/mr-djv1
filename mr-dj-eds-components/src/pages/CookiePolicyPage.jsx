import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Molecules/Header.jsx';
import Footer from '../components/Organisms/Footer.jsx';

const CookiePolicyPage = () => {
  return (
    <div className="CookiePolicyPage bg-gray-50">
      <Helmet>
        <title>Cookieverklaring | Mr. DJ</title>
        <meta
          name="description"
          content="Cookieverklaring van Mr. DJ. Lees hoe wij cookies gebruiken op onze website en hoe u uw cookievoorkeuren kunt beheren."
        />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A2C4B] to-[#00AEEF] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Cookieverklaring</h1>
            <p className="text-xl text-white/90">
              Informatie over het gebruik van cookies op mr-dj.sevensa.nl
            </p>
            <p className="text-sm text-white/80 mt-4">
              Laatste update: Oktober 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* 1. Wat zijn cookies */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🍪</span>
                1. Wat zijn cookies?
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Cookies zijn kleine tekstbestanden die op uw computer, tablet of smartphone worden
                  geplaatst wanneer u onze website bezoekt. Deze bestanden bevatten informatie die bij
                  een volgend bezoek weer naar onze website wordt teruggestuurd.
                </p>
                <p className="mb-4">
                  Cookies zorgen ervoor dat onze website goed werkt en dat we kunnen zien hoe bezoekers
                  onze website gebruiken. Hierdoor kunnen we de website steeds verder verbeteren.
                </p>
              </div>
            </div>

            {/* 2. Waarom gebruiken wij cookies */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🎯</span>
                2. Waarom gebruiken wij cookies?
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">Mr. DJ gebruikt cookies voor de volgende doeleinden:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Het goed laten functioneren van de website (functionele cookies)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Het analyseren van het gebruik van de website (analytische cookies)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Het onthouden van uw voorkeuren en instellingen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Het verbeteren van de gebruikerservaring</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. Soorten cookies */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">📊</span>
                3. Welke cookies gebruiken wij?
              </h2>

              {/* Functionele cookies */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">
                  3.1 Functionele cookies (noodzakelijk)
                </h3>
                <p className="text-gray-700 mb-4">
                  Deze cookies zijn noodzakelijk voor het goed functioneren van de website.
                  Zonder deze cookies werkt de website niet naar behoren.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-[#1A2C4B]">Cookie</th>
                        <th className="text-left py-2 text-[#1A2C4B]">Doel</th>
                        <th className="text-left py-2 text-[#1A2C4B]">Bewaartermijn</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono text-xs">session_id</td>
                        <td className="py-2">Sessiegegevens beheren</td>
                        <td className="py-2">Sessie</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono text-xs">cookie_consent</td>
                        <td className="py-2">Uw cookievoorkeuren onthouden</td>
                        <td className="py-2">1 jaar</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-xs">csrf_token</td>
                        <td className="py-2">Beveiliging formulieren</td>
                        <td className="py-2">Sessie</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytische cookies */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">
                  3.2 Analytische cookies (Google Analytics)
                </h3>
                <p className="text-gray-700 mb-4">
                  We gebruiken Google Analytics om te analyseren hoe bezoekers onze website gebruiken.
                  Deze informatie helpt ons de website te verbeteren. De gegevens worden geanonimiseerd
                  verzameld en we hebben een verwerkersovereenkomst met Google gesloten.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-[#1A2C4B]">Cookie</th>
                        <th className="text-left py-2 text-[#1A2C4B]">Doel</th>
                        <th className="text-left py-2 text-[#1A2C4B]">Bewaartermijn</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono text-xs">_ga</td>
                        <td className="py-2">Unieke gebruikers onderscheiden</td>
                        <td className="py-2">2 jaar</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-mono text-xs">_gid</td>
                        <td className="py-2">Unieke gebruikers onderscheiden</td>
                        <td className="py-2">24 uur</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-xs">_gat</td>
                        <td className="py-2">Verzoekpercentage beperken</td>
                        <td className="py-2">1 minuut</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Let op:</strong> Voor het plaatsen van deze cookies vragen wij uw toestemming.
                </p>
              </div>

              {/* Social media cookies */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1A2C4B] mb-3">
                  3.3 Social media cookies
                </h3>
                <p className="text-gray-700 mb-4">
                  Op onze website hebben we social media buttons geïntegreerd (Facebook, Instagram, LinkedIn).
                  Deze diensten kunnen cookies plaatsen via deze buttons. Het gebruik van deze cookies valt
                  onder het privacybeleid van deze externe partijen.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Facebook:</strong> <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">facebook.com/privacy</a></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Instagram:</strong> <a href="https://help.instagram.com/519522125107875" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">instagram.com/legal/privacy</a></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/legal/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">linkedin.com/legal/cookie-policy</a></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Cookies beheren */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⚙️</span>
                4. Hoe kunt u cookies beheren?
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  U kunt op verschillende manieren uw cookievoorkeuren beheren:
                </p>

                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Via uw browser</h3>
                <p className="mb-4">
                  De meeste browsers zijn standaard ingesteld om cookies te accepteren. U kunt uw browser
                  zo instellen dat cookies automatisch worden geweigerd of dat u per cookie kunt aangeven
                  of u deze accepteert of niet.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-bold mb-2">Cookies uitschakelen per browser:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Google Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies en andere sitegegevens</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Firefox:</strong> Opties → Privacy & Beveiliging → Cookies en sitegegevens</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Safari:</strong> Voorkeuren → Privacy → Cookies en websitegegevens</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-2">•</span>
                      <span><strong>Microsoft Edge:</strong> Instellingen → Cookies en sitemachtigingen → Cookies en sitegegevens</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-[#1A2C4B] mb-3">Externe tools</h3>
                <p className="mb-4">
                  U kunt ook gebruik maken van externe tools om cookies te beheren:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">•</span>
                    <span><a href="https://www.youronlinechoices.com/nl/" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">Your Online Choices</a> - Opt-out tool voor advertentiecookies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">•</span>
                    <span><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#00AEEF] hover:underline">Google Analytics Opt-out Browser Add-on</a></span>
                  </li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Let op:</strong> Als u alle cookies uitschakelt, is het mogelijk dat bepaalde
                    onderdelen van onze website niet goed meer werken. Ook kunnen bepaalde voorkeuren
                    niet worden onthouden.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Toestemming */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">✅</span>
                5. Toestemming voor cookies
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Bij uw eerste bezoek aan onze website vragen wij u om toestemming voor het plaatsen
                  van bepaalde cookies. U kunt deze toestemming op elk moment intrekken door:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">•</span>
                    <span>De cookies in uw browser te verwijderen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">•</span>
                    <span>Uw cookievoorkeuren aan te passen via uw browserinstellingen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">•</span>
                    <span>Contact met ons op te nemen via <a href="mailto:[email protected]" className="text-[#00AEEF] hover:underline">[email protected]</a></span>
                  </li>
                </ul>
                <p className="mb-4">
                  <strong>Functionele cookies</strong> (noodzakelijke cookies) kunnen worden geplaatst zonder
                  uw toestemming, omdat deze nodig zijn voor het goed functioneren van de website.
                </p>
              </div>
            </div>

            {/* 6. Third-party cookies */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🔗</span>
                6. Cookies van derden
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Sommige cookies op onze website worden geplaatst door diensten van derden. Denk hierbij aan:
                </p>
                <ul className="space-y-3 mb-4">
                  <li className="bg-gray-50 p-3 rounded">
                    <strong className="text-[#1A2C4B]">Google Analytics:</strong>
                    <p className="text-sm mt-1">
                      Voor het analyseren van websitebezoek. Google kan deze gegevens aan derden verstrekken
                      indien Google hiertoe wettelijk wordt verplicht. Wij hebben hier geen invloed op.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-3 rounded">
                    <strong className="text-[#1A2C4B]">Social Media Platforms:</strong>
                    <p className="text-sm mt-1">
                      Voor het integreren van social media content en share-functionaliteit. Deze partijen
                      kunnen uw surfgedrag volgen via deze cookies.
                    </p>
                  </li>
                </ul>
                <p className="mb-4">
                  Het gebruik van cookies door deze derden valt onder hun eigen privacyverklaring en
                  cookiebeleid. Mr. DJ heeft hier geen invloed op.
                </p>
              </div>
            </div>

            {/* 7. Bewaartermijn */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⏱️</span>
                7. Hoe lang bewaren wij cookies?
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  De bewaartermijn van cookies verschilt per type:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-3 font-bold">•</span>
                      <span><strong>Sessiecookies:</strong> Worden automatisch verwijderd wanneer u uw browser sluit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-3 font-bold">•</span>
                      <span><strong>Permanente cookies:</strong> Blijven op uw apparaat staan tot de vervaldatum of tot u ze verwijdert</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#00AEEF] mr-3 font-bold">•</span>
                      <span><strong>Analytische cookies:</strong> Maximaal 2 jaar (zoals Google Analytics _ga cookie)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 8. Uw rechten */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">⚖️</span>
                8. Uw rechten
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  U heeft het recht om:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Inzage te krijgen in de cookies die wij plaatsen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Uw toestemming voor cookies in te trekken</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Bezwaar te maken tegen het gebruik van cookies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00AEEF] mr-2">✓</span>
                    <span>Cookies te verwijderen via uw browserinstellingen</span>
                  </li>
                </ul>
                <p className="mb-4">
                  Voor meer informatie over uw privacyrechten, zie onze <a href="/privacy-policy" className="text-[#00AEEF] hover:underline">Privacyverklaring</a>.
                </p>
              </div>
            </div>

            {/* 9. Wijzigingen */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-3xl font-bold text-[#1A2C4B] mb-4 flex items-center">
                <span className="text-[#00AEEF] mr-3">🔄</span>
                9. Wijzigingen in deze cookieverklaring
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Mr. DJ kan deze cookieverklaring van tijd tot tijd aanpassen. We raden u aan om deze
                  cookieverklaring regelmatig te raadplegen, zodat u op de hoogte blijft van eventuele
                  wijzigingen.
                </p>
                <p className="mb-4">
                  Deze cookieverklaring is voor het laatst gewijzigd op: <strong>Oktober 2024</strong>
                </p>
              </div>
            </div>

            {/* 10. Contact */}
            <div className="bg-gradient-to-r from-[#00AEEF] to-[#0096D6] text-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <span className="mr-3">📧</span>
                10. Vragen over cookies?
              </h2>
              <p className="mb-6">
                Als u vragen heeft over ons gebruik van cookies of deze cookieverklaring, neem dan
                gerust contact met ons op:
              </p>
              <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <p className="flex items-center gap-3">
                  <span className="text-2xl">🏢</span>
                  <span><strong>Mr. DJ</strong></span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <span>Kapteijnlaan 17, Veldhoven</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <a href="tel:+31408422594" className="hover:underline">040-8422594</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <a href="mailto:[email protected]" className="hover:underline">[email protected]</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
