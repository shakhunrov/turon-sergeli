import { useLang } from '../../shared/i18n';
import './Policies.css';

export default function Policies() {
  const { t } = useLang();

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">Huquqiy</span>
          <h1 className="section-title">Siyosat va muvofiqlik</h1>
          <div className="divider" />
        </div>
      </div>

      <section className="section">
        <div className="container policies-content">
          {[
            {
              id: 'privacy',
              icon: '🔒',
              title: t.footer.policies,
              content: 'Turon International School is committed to protecting the privacy and personal data of all students, parents, and staff. We collect only the information necessary to provide our educational services and never share personal data with third parties without consent, except where required by law. All data is stored securely and in accordance with applicable data protection regulations.',
            },
            {
              id: 'safeguarding',
              icon: '🛡️',
              title: t.footer.safeguarding,
              content: 'The safety and well-being of every student is our highest priority. Turon International School has a comprehensive child protection policy aligned with international best practices. All staff undergo background checks and safeguarding training. Any concerns about student safety are taken seriously and addressed promptly in accordance with our established procedures.',
            },
            {
              id: 'terms',
              icon: '📋',
              title: t.footer.terms,
              content: 'By enrolling your child at Turon International School, you agree to our terms and conditions regarding school fees, attendance, code of conduct, and academic expectations. Our school reserves the right to update these terms with appropriate notice to families. A full copy of our terms and conditions is available from the school administration.',
            },
          ].map((policy) => (
            <div key={policy.id} id={policy.id} className="policy-block glass-card">
              <div className="policy-icon">{policy.icon}</div>
              <div>
                <h2 className="policy-title">{policy.title}</h2>
                <p className="policy-text">{policy.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
