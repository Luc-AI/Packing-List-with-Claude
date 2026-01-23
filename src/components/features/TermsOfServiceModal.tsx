import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC-Key Handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus Trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab as EventListener);
    firstElement?.focus();

    return () => modal.removeEventListener('keydown', handleTab as EventListener);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Container */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-3xl glass-card rounded-[24px] p-6 sm:p-8 max-h-[80vh] overflow-y-auto animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="terms-modal-title" className="text-2xl text-glass-primary">
            Nutzungsbedingungen
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-glass-secondary">
          <p className="text-sm text-glass-muted">Stand: Januar 2026</p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">1. Anbieter</h3>
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
            <h3 className="text-lg font-semibold text-white">2. Geltungsbereich</h3>
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
            <h3 className="text-lg font-semibold text-white">3. Leistungsbeschreibung</h3>
            <p className="leading-relaxed">
              „Guet Parat" ist eine Web-App zur Erstellung und Verwaltung persönlicher Packlisten.
            </p>
            <p className="leading-relaxed">
              Die bereitgestellten Funktionen können jederzeit angepasst, erweitert oder eingestellt werden.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">4. Registrierung und Nutzung</h3>
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
            <h3 className="text-lg font-semibold text-white">5. Inhalte der Nutzer:innen</h3>
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
            <h3 className="text-lg font-semibold text-white">6. Verfügbarkeit</h3>
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
            <h3 className="text-lg font-semibold text-white">7. Haftung</h3>
            <p className="leading-relaxed">Die Nutzung der App erfolgt auf eigenes Risiko.</p>
            <p className="leading-relaxed">
              Der Betreiber haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten
              beruhen. Eine Haftung für indirekte Schäden, Datenverluste oder entgangene Vorteile ist
              ausgeschlossen, soweit gesetzlich zulässig.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">8. Einstellung des Dienstes</h3>
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
            <h3 className="text-lg font-semibold text-white">9. Änderungen der Nutzungsbedingungen</h3>
            <p className="leading-relaxed">
              Diese Nutzungsbedingungen können jederzeit angepasst werden. Es gilt jeweils die zum Zeitpunkt
              der Nutzung aktuelle Version.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">10. Anwendbares Recht</h3>
            <p className="leading-relaxed">
              Es gilt ausschließlich Schweizer Recht, unter Ausschluss kollisionsrechtlicher Normen.
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
