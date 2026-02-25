import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-serif font-semibold text-charcoal mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  const lastUpdated = 'February 2025';

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <p className="text-gray-600 leading-relaxed mb-8">
            Welcome to Glow & Glam. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website
            or use our services.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Name, phone number, and email address when you register or book an appointment</li>
              <li>Payment information (processed securely — we do not store card details)</li>
              <li>Messages and inquiries submitted through our contact form</li>
              <li>Appointment preferences, service history, and notes</li>
            </ul>
            <p>We also automatically collect certain information when you use our website, such as your IP address, browser type, and pages visited.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Process and manage your bookings and appointments</li>
              <li>Send you booking confirmations and reminders</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send promotional offers and updates (you may opt out at any time)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Payment processors</strong> (such as Razorpay or UPI providers) to complete transactions</li>
              <li><strong>Service providers</strong> who assist in operating our website (e.g., cloud hosting)</li>
              <li><strong>Legal authorities</strong> when required by law or to protect our rights</li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. All payment transactions are
              encrypted using SSL technology.
            </p>
            <p>
              However, no method of transmission over the Internet or method of electronic storage is 100% secure.
              While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your
              device that help us remember your preferences and understand how you use our site.
            </p>
            <p>You can choose to disable cookies through your browser settings, though this may affect some functionality of our website.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with
              legal obligations. Booking records are typically retained for 3 years for business and tax purposes.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our services are not directed to children under the age of 13. We do not knowingly collect personal
              information from children. If you believe we have inadvertently collected such information, please
              contact us immediately.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes
              by posting the new policy on this page with an updated date. Your continued use of our services
              after any changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <div className="bg-cream rounded-xl p-4 mt-3 space-y-1">
              <p><strong>Glow & Glam</strong></p>
              <p>123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400050</p>
              <p>Email: <a href="mailto:hello@glowglam.com" className="text-gold hover:underline">hello@glowglam.com</a></p>
              <p>Phone: <a href="tel:+919876543210" className="text-gold hover:underline">+91 98765 43210</a></p>
            </div>
          </Section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
