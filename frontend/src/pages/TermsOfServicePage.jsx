import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-serif font-semibold text-charcoal mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsOfServicePage = () => {
  const lastUpdated = 'February 2025';

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <p className="text-gray-600 leading-relaxed mb-8">
            Please read these Terms of Service carefully before using the Glow & Glam website or booking any of our
            services. By accessing our website or making a booking, you agree to be bound by these terms.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>
              By using our website, booking our services, or making a payment, you confirm that you are at least
              18 years of age and agree to comply with these Terms of Service. If you do not agree with any part
              of these terms, please do not use our services.
            </p>
          </Section>

          <Section title="2. Appointments & Bookings">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>All appointments must be booked in advance through our website or by contacting us directly.</li>
              <li>Bookings are confirmed only after payment of the required advance amount (or full payment).</li>
              <li>Please arrive at least 10 minutes before your scheduled appointment time.</li>
              <li>Glow & Glam reserves the right to reschedule appointments in case of unforeseen circumstances, with prior notice.</li>
              <li>We reserve the right to refuse service to anyone who is rude, abusive, or behaves inappropriately toward our staff.</li>
            </ul>
          </Section>

          <Section title="3. Cancellation Policy">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>24+ hours notice:</strong> Full refund or free rescheduling</li>
              <li><strong>12–24 hours notice:</strong> 50% of advance amount refunded; free rescheduling once</li>
              <li><strong>Less than 12 hours / No-show:</strong> Advance amount is non-refundable</li>
              <li>Cancellations must be made through our website or by calling us directly</li>
            </ul>
            <p>
              In case of cancellation by Glow & Glam (e.g., due to staff unavailability or emergencies), you will
              receive a full refund and be offered a priority rescheduling slot.
            </p>
          </Section>

          <Section title="4. Payments">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>We accept UPI, Razorpay (cards, net banking, wallets), and cash at the salon.</li>
              <li>A partial advance (as specified during booking) is required to confirm your appointment.</li>
              <li>The remaining balance is due at the time of your appointment.</li>
              <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes.</li>
              <li>Prices are subject to change without prior notice, but confirmed bookings will honor the price at time of booking.</li>
            </ul>
          </Section>

          <Section title="5. Services">
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Service results may vary depending on individual skin/hair type and condition.</li>
              <li>Please inform our staff of any allergies, skin conditions, or medical conditions before your appointment.</li>
              <li>Glow & Glam is not liable for adverse reactions resulting from undisclosed medical conditions or allergies.</li>
              <li>We use professional-grade products; however, if you have known sensitivities, please bring this to our attention.</li>
              <li>Service durations are approximate and may vary.</li>
            </ul>
          </Section>

          <Section title="6. Health & Safety">
            <p>
              For the safety of all our clients and staff, we request that you:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Do not visit if you are unwell, have a contagious condition, or have open wounds/infections in the treatment area</li>
              <li>Disclose any medical conditions, pregnancy, or medications that may affect your treatment</li>
              <li>Follow post-treatment care instructions provided by our therapists</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              All content on this website, including text, images, logos, and graphics, is the property of
              Glow & Glam and is protected by applicable intellectual property laws. You may not reproduce,
              distribute, or use any content without our prior written consent.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Glow & Glam shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of our services or website.
              Our total liability shall not exceed the amount you paid for the specific service in question.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of India.
              Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts
              in Mumbai, Maharashtra.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective
              immediately upon posting to our website. Your continued use of our services constitutes acceptance
              of the revised terms.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>For questions about these Terms of Service, please contact us:</p>
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

export default TermsOfServicePage;
