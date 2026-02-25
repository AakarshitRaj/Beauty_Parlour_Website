import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-serif font-semibold text-charcoal mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const RefundPolicyPage = () => {
  const lastUpdated = 'February 2025';

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-br from-pink-light via-cream to-gold-light">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl font-serif font-bold text-charcoal mb-4">Refund Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

          <p className="text-gray-600 leading-relaxed mb-8">
            At Glow & Glam, your satisfaction is our priority. This Refund Policy outlines the conditions under
            which refunds are issued for appointments and services.
          </p>

          {/* Quick Summary Table */}
          <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100">
            <div className="bg-charcoal px-6 py-4">
              <h3 className="text-white font-semibold font-serif">Cancellation & Refund Summary</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">When you cancel</th>
                  <th className="px-6 py-3 text-left">Refund</th>
                  <th className="px-6 py-3 text-left">Rescheduling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ['24+ hours before appointment',  'Full refund',           'Free, unlimited'],
                  ['12–24 hours before appointment', '50% of advance',       'Free, once'],
                  ['Less than 12 hours notice',      'No refund',            'Not available'],
                  ['No-show (did not attend)',        'No refund',            'Not available'],
                  ['Cancelled by Glow & Glam',       'Full refund',          'Priority slot offered'],
                ].map(([when, refund, reschedule]) => (
                  <tr key={when} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-charcoal font-medium">{when}</td>
                    <td className={`px-6 py-4 font-medium ${refund === 'Full refund' ? 'text-green-600' : refund === 'No refund' ? 'text-red-500' : 'text-amber-600'}`}>{refund}</td>
                    <td className="px-6 py-4 text-gray-500">{reschedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Section title="1. Eligibility for Refund">
            <p>You are eligible for a refund if:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You cancel your appointment at least 24 hours before the scheduled time</li>
              <li>Glow & Glam cancels or is unable to fulfill your booked appointment</li>
              <li>A service was not delivered as described due to our error</li>
              <li>A technical error resulted in a duplicate payment</li>
            </ul>
          </Section>

          <Section title="2. Non-Refundable Situations">
            <p>Refunds will <strong>not</strong> be issued in the following cases:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Cancellation less than 12 hours before the appointment</li>
              <li>No-show (failing to attend without prior cancellation)</li>
              <li>Dissatisfaction based on personal preference after service completion</li>
              <li>Failure to disclose medical conditions that affected the service outcome</li>
              <li>Change of mind after service has been rendered</li>
            </ul>
          </Section>

          <Section title="3. How to Request a Refund">
            <p>To request a refund, please follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Cancel your booking through your account dashboard or by contacting us</li>
              <li>Contact us via email at <a href="mailto:hello@glowglam.com" className="text-gold hover:underline">hello@glowglam.com</a> or call <a href="tel:+919876543210" className="text-gold hover:underline">+91 98765 43210</a></li>
              <li>Provide your booking ID, name, and reason for the refund request</li>
              <li>Our team will review and respond within 2 business days</li>
            </ol>
          </Section>

          <Section title="4. Refund Processing Time">
            <p>Once your refund is approved:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>UPI payments:</strong> 1–3 business days to the original UPI account</li>
              <li><strong>Razorpay (card/net banking/wallet):</strong> 5–7 business days to the original payment method</li>
              <li><strong>Cash payments:</strong> Refunded in cash at the salon or via UPI transfer within 2 business days</li>
            </ul>
            <p className="text-sm text-gray-400 mt-2">
              Processing times may vary depending on your bank or payment provider. Glow & Glam is not responsible
              for delays caused by financial institutions.
            </p>
          </Section>

          <Section title="5. Service Quality Concerns">
            <p>
              If you are unsatisfied with a service due to our error or quality issue, please inform us within
              48 hours of your appointment. We will:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Offer a complimentary correction appointment, or</li>
              <li>Provide a partial or full refund at our discretion, depending on the nature of the concern</li>
            </ul>
            <p>
              We take every feedback seriously and are committed to making it right.
            </p>
          </Section>

          <Section title="6. Duplicate Payments">
            <p>
              If you are charged more than once for the same booking due to a technical error, please contact
              us immediately with your transaction details. Duplicate charges will be refunded in full within
              3–5 business days.
            </p>
          </Section>

          <Section title="7. Rescheduling">
            <p>
              We encourage rescheduling over cancellation wherever possible. If you need to reschedule:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Rescheduling is free if done 24+ hours in advance</li>
              <li>Each booking may be rescheduled a maximum of 2 times</li>
              <li>Rescheduled appointments must be within 30 days of the original booking</li>
            </ul>
          </Section>

          <Section title="8. Contact Us">
            <p>For refund requests or questions about this policy, reach us at:</p>
            <div className="bg-cream rounded-xl p-4 mt-3 space-y-1">
              <p><strong>Glow & Glam</strong></p>
              <p>123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400050</p>
              <p>Email: <a href="mailto:hello@glowglam.com" className="text-gold hover:underline">hello@glowglam.com</a></p>
              <p>Phone: <a href="tel:+919876543210" className="text-gold hover:underline">+91 98765 43210</a></p>
              <p className="text-xs text-gray-400 mt-2">Working hours: Mon–Sat 10AM–8PM, Sun 11AM–6PM</p>
            </div>
          </Section>

          {/* Links to other policies */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 mb-4">Related policies:</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy-policy" className="text-sm text-gold hover:underline">Privacy Policy →</Link>
              <Link to="/terms-of-service" className="text-sm text-gold hover:underline">Terms of Service →</Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
