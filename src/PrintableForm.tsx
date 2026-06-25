import { FileText } from 'lucide-react';

type PrintableFormClient = {
  firstName: string;
  lastName: string;
  birthDate?: string;
  program?: string;
  operationalId?: string | null;
  phone?: string;
  email?: string;
  address?: string;
};

type PrintableFormTemplate = {
  id: string;
  formUid?: string;
  title: string;
  formGroup?: string;
  folder?: string;
  fields: Array<{ key: string; label: string; rows?: number }>;
};

type PrintableFormProps = {
  client: PrintableFormClient | null;
  template: PrintableFormTemplate;
  draft: Record<string, string>;
};

const cleanPrintableFormTitle = (title: string) =>
  title
    .replace(/^([A-Z]{2,5}-FRM-[A-Z0-9-]+-\d{3,4})\s*[-–]\s*/i, '')
    .replace(/^([A-Z]{2,5}-\d{2,4})\s*[-–]\s*/i, '')
    .replace(/\bGDPR\s+0?0?1\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\bKryci\b/gi, 'Krycí')
    .replace(/\bList\b/g, 'list')
    .replace(/\bBalicku\b/gi, 'balíčku')
    .replace(/\bStiznosti\b/gi, 'stížností')
    .replace(/\bSouhlasu\b/gi, 'souhlasu')
    .replace(/\bUdaju\b/gi, 'údajů')
    .replace(/\bPribehu\b/gi, 'příběhu')
    .replace(/\bCitace\b/gi, 'citace')
    .replace(/\bKazuistika\b/gi, 'kazuistika')
    .replace(/\bMlcenlivost\b/gi, 'mlčenlivost');

export default function PrintableForm({ client, template, draft }: PrintableFormProps) {
  const clientName = client ? `${client.firstName} ${client.lastName}`.trim() : '';
  const printDate = new Date().toLocaleDateString('cs-CZ');
  const internalId = client?.operationalId?.trim() || 'bude doplněno';
  const documentCode = [template.formUid || template.id, client?.operationalId].filter(Boolean).join(' / ') || template.id;
  const printableTitle = cleanPrintableFormTitle(template.title);

  return (
    <article className="print-sheet print-sheet-branded">
      <div className="print-brand-ribbon">
        <div className="print-brand-identity">
          <div className="print-brand-mark" aria-hidden="true">
            <img src="/images/brand/restart-integrace-mark.png" alt="" />
          </div>
          <p className="print-brand-nameplate">REST||ART INTEGRACE</p>
          <span>Provozní formulář projektu druhých šancí</span>
        </div>
        <div className="print-brand-code">
          <strong>{documentCode}</strong>
          <span>{printDate}</span>
        </div>
      </div>
      <div className="print-header">
        <div>
          <p>{template.formGroup || template.folder || 'Tisková šablona'}</p>
          <h2>{printableTitle || template.title}</h2>
        </div>
        <FileText size={34} />
      </div>
      {!client ? (
        <p className="empty-note">Vyberte klienta pro náhled tiskového formuláře.</p>
      ) : (
        <>
          <div className="print-meta">
            <div>
              <span>Klient</span>
              <strong>{clientName}</strong>
            </div>
            <div>
              <span>Datum narození</span>
              <strong>{client.birthDate || '-'}</strong>
            </div>
            <div>
              <span>Program</span>
              <strong>{client.program}</strong>
            </div>
            <div>
              <span>Interní ID</span>
              <strong>{internalId}</strong>
            </div>
          </div>
          <div className="print-block print-block-highlight">
            <span>Kontakt a adresa</span>
            <p>{[client.phone, client.email, client.address].filter(Boolean).join(' | ') || '-'}</p>
          </div>
          {template.fields.map((field, index) => (
            <div className="print-block print-block-numbered" key={field.key}>
              <span><small>{String(index + 1).padStart(2, '0')}</small>{field.label}</span>
              <p>{draft[field.key] || ' '}</p>
            </div>
          ))}
          <div className="print-form-footer-note">
            <strong>Kontrolní poznámka</strong>
            <span>Vyplněný formulář založte do klientské složky a navazující dokumenty evidujte v administraci.</span>
          </div>
          <div className="signature-grid">
            <div>
              <span>Podpis klienta</span>
            </div>
            <div>
              <span>Podpis pracovníka</span>
            </div>
          </div>
          <footer className="print-document-footer">
            <span>David Kozák International, s.r.o. | projekt RESTART</span>
            <strong>1/1</strong>
          </footer>
        </>
      )}
    </article>
  );
}
