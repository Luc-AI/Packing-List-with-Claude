import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Nutzungsbedingungen</h1>
          <Link
            to="/login"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Zurück</span>
          </Link>
        </div>

        {/* Content */}
        <GlassCard className="p-8">
          <div className="space-y-6 text-white/85">
            <p className="text-sm text-white/70">Stand: Januar 2026</p>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Anbieter</h2>
              <p className="leading-relaxed">
                Diese Web-App wird betrieben als privates, nicht-kommerzielles Webprojekt unter dem Namen:
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">Guet Parat</strong>
                <br />
                Kontakt:{' '}
                <a
                  href="mailto:privacy@guetparat.app"
                  className="text-white underline hover:text-white/80 transition-colors"
                >
                  privacy@guetparat.app
                </a>
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">2. Geltungsbereich</h2>
              <p className="leading-relaxed">
                Diese Nutzungsbedingungen regeln die Nutzung der Web-App „Guet Parat" und aller
                darüber bereitgestellten Funktionen.
              </p>
              <p className="leading-relaxed">
                Mit der Nutzung der App erklärst du dich mit diesen Nutzungsbedingungen einverstanden.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. Leistungsbeschreibung</h2>
              <p className="leading-relaxed">
                „Guet Parat" ist eine Web-App zur Erstellung und Verwaltung persönlicher Packlisten.
              </p>
              <p className="leading-relaxed">
                Die bereitgestellten Funktionen können jederzeit angepasst, erweitert oder eingestellt werden.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. Registrierung und Nutzung</h2>
              <p className="leading-relaxed">
                Die Nutzung bestimmter Funktionen setzt eine Registrierung voraus. Die Anmeldung kann
                insbesondere über einen externen Authentifizierungsdienst (z. B. Google OAuth) erfolgen.
              </p>
              <p className="leading-relaxed">Nutzer:innen sind verpflichtet:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>wahrheitsgemäße Angaben zu machen</li>
                <li>die App nicht missbräuchlich zu verwenden</li>
                <li>keine rechtswidrigen oder schädlichen Inhalte zu speichern</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Inhalte der Nutzer:innen</h2>
              <p className="leading-relaxed">
                Alle von Nutzer:innen erstellten Inhalte verbleiben im Eigentum der jeweiligen Nutzer:innen.
              </p>
              <p className="leading-relaxed">
                Mit der Nutzung der App räumst du dem Betreiber das technisch notwendige Recht ein, diese
                Inhalte zu speichern, zu verarbeiten und darzustellen, um die Funktion der App zu ermöglichen.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Verfügbarkeit</h2>
              <p className="leading-relaxed">Es besteht kein Anspruch auf permanente Verfügbarkeit der App.</p>
              <p className="leading-relaxed">
                Der Betreiber bemüht sich um einen zuverlässigen Betrieb, übernimmt jedoch keine Garantie für:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>unterbrechungsfreie Nutzung</li>
                <li>Fehlerfreiheit</li>
                <li>Datenverfügbarkeit zu jeder Zeit</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">7. Haftung</h2>
              <p className="leading-relaxed">Die Nutzung der App erfolgt auf eigenes Risiko.</p>
              <p className="leading-relaxed">
                Der Betreiber haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten
                beruhen. Eine Haftung für indirekte Schäden, Datenverluste oder entgangene Vorteile ist
                ausgeschlossen, soweit gesetzlich zulässig.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">8. Einstellung des Dienstes</h2>
              <p className="leading-relaxed">
                Der Betreiber behält sich das Recht vor, den Betrieb der App jederzeit ganz oder teilweise
                einzustellen.
              </p>
              <p className="leading-relaxed">
                Ein Anspruch auf Fortführung oder Datenaufbewahrung besteht nicht.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">9. Änderungen der Nutzungsbedingungen</h2>
              <p className="leading-relaxed">
                Diese Nutzungsbedingungen können jederzeit angepasst werden. Es gilt jeweils die zum Zeitpunkt
                der Nutzung aktuelle Version.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">10. Anwendbares Recht</h2>
              <p className="leading-relaxed">
                Es gilt ausschließlich Schweizer Recht, unter Ausschluss kollisionsrechtlicher Normen.
              </p>
            </section>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
