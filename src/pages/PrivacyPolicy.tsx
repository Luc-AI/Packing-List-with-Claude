import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header mit Zurück-Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Datenschutzerklärung</h1>
          <Link
            to="/login"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Zurück</span>
          </Link>
        </div>

        {/* Content in GlassCard */}
        <GlassCard className="p-8">
          <div className="space-y-6 text-white/85">
            {/* Stand */}
            <p className="text-sm text-white/70">Stand: Januar 2026</p>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Verantwortlicher</h2>
              <p className="leading-relaxed">
                Verantwortlich für die Datenverarbeitung im Rahmen dieser Web-App ist:
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">Guet Parat</strong>
                <br />
                Privates, nicht-kommerzielles Webprojekt
                <br />
                E-Mail:{' '}
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
              <h2 className="text-xl font-semibold text-white">2. Zweck der Datenverarbeitung</h2>
              <p className="leading-relaxed">
                Die Web-App „Guet Parat" ermöglicht Nutzerinnen und Nutzern das Erstellen und
                Verwalten persönlicher Packlisten.
              </p>
              <p className="leading-relaxed">
                Zur Nutzung bestimmter Funktionen ist eine Anmeldung erforderlich.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. Anmeldung über Google (OAuth)</h2>
              <p className="leading-relaxed">
                Die Anmeldung kann optional über den Dienst Google OAuth erfolgen.
              </p>
              <p className="leading-relaxed">
                Dabei werden folgende personenbezogene Daten von Google an die App übermittelt:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>E-Mail-Adresse</li>
                <li>Anzeigename</li>
                <li>Eindeutige Google-User-ID</li>
              </ul>
              <p className="leading-relaxed">Diese Daten werden ausschließlich verwendet zur:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Authentifizierung der Nutzer:innen</li>
                <li>Bereitstellung eines personalisierten Benutzerkontos</li>
                <li>Zuordnung der gespeicherten Inhalte</li>
              </ul>
              <p className="leading-relaxed">
                Eine Weitergabe der Daten an Dritte oder eine Nutzung zu Werbezwecken findet nicht
                statt.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. Verarbeitete Nutzerdaten</h2>
              <p className="leading-relaxed">
                Im Rahmen der Nutzung der App können folgende Daten gespeichert werden:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Benutzerkonto (z. B. E-Mail-Adresse, User-ID)</li>
                <li>Vom Nutzer erstellte Inhalte (z. B. Packlisten)</li>
              </ul>
              <p className="leading-relaxed">
                Die Daten werden ausschließlich zur Erbringung der App-Funktionalität verwendet.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Hosting und Infrastruktur</h2>
              <p className="leading-relaxed">
                Die App wird über Dienste der Amazon Web Services (AWS) betrieben, insbesondere:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Amazon S3 (Datenspeicherung)</li>
                <li>Amazon CloudFront (Content-Auslieferung)</li>
              </ul>
              <p className="leading-relaxed">
                Dabei kann es zur Verarbeitung personenbezogener Daten auf Servern außerhalb der
                Schweiz oder der Europäischen Union kommen. AWS verpflichtet sich zur Einhaltung
                anerkannter Datenschutz- und Sicherheitsstandards.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Cookies</h2>
              <p className="leading-relaxed">
                Diese Web-App verwendet ausschließlich technisch notwendige Cookies, die für den
                Anmeldeprozess und den Betrieb der Anwendung erforderlich sind.
              </p>
              <p className="leading-relaxed">
                Es werden keine Analyse-, Tracking- oder Marketing-Cookies eingesetzt.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">7. Rechte der Nutzer:innen</h2>
              <p className="leading-relaxed">Nutzer:innen haben jederzeit das Recht auf:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Auskunft über die gespeicherten personenbezogenen Daten</li>
                <li>Berichtigung unrichtiger Daten</li>
                <li>Löschung der Daten</li>
                <li>Einschränkung oder Widerruf der Einwilligung</li>
              </ul>
              <p className="leading-relaxed">
                Anfragen können jederzeit per E-Mail an{' '}
                <a
                  href="mailto:privacy@guetparat.app"
                  className="text-white underline hover:text-white/80 transition-colors"
                >
                  privacy@guetparat.app
                </a>{' '}
                gestellt werden.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">
                8. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="leading-relaxed">
                Diese Datenschutzerklärung kann angepasst werden, wenn sich Funktionen der App oder
                rechtliche Anforderungen ändern.
              </p>
            </section>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
