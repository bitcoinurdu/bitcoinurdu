import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Privacy Policy' });

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>BitcoinUrdu.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our platform. By accessing or using BitcoinUrdu, you consent to the practices described in this policy.</p>
          <p>This policy applies to all users of our website, mobile applications, APIs, and any related services. If you do not agree with the terms of this Privacy Policy, please discontinue use of our services immediately.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">2.1 Information You Provide Directly</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, username, and password.</li>
            <li><strong>Profile Data:</strong> Any additional information you choose to add to your profile, such as a profile picture, bio, or preferences.</li>
            <li><strong>Portfolio Data:</strong> Cryptocurrency holdings, wallet addresses, transaction history, and investment preferences you enter into our portfolio tracker.</li>
            <li><strong>Communications:</strong> Messages, inquiries, feedback, or support requests you send through our contact forms, email, or other communication channels.</li>
            <li><strong>Ad Inquiry Data:</strong> Name, email, company, website, and message details submitted through our advertising inquiry forms.</li>
            <li><strong>Job Application Data:</strong> Resume, cover letter, and application details submitted through our jobs section.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Device Information:</strong> Hardware model, operating system, browser type, screen resolution, and unique device identifiers.</li>
            <li><strong>Log Data:</strong> IP address, access times, pages viewed, referring URLs, clickstream data, and browsing patterns.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, local storage, web beacons, and similar technologies to enhance your experience, analyze usage patterns, and serve relevant content.</li>
            <li><strong>Location Data:</strong> Approximate geographic location based on your IP address (country, city level). We do not collect precise GPS location.</li>
            <li><strong>Usage Analytics:</strong> How you interact with our platform, including features used, time spent on pages, search queries, and navigation patterns.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">2.3 Information from Third Parties</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Cryptocurrency APIs:</strong> Market data, prices, and coin information from CoinGecko and other public APIs.</li>
            <li><strong>Mining Data APIs:</strong> Network difficulty and hashrate data from Mempool.space. Blockchain data from Etherscan, BscScan, and Polygonscan APIs.</li>
            <li><strong>Reference Data:</strong> Mining hardware specifications and profitability references from WhatToMine, AsicMinerValue, and MiningPoolStats.</li>
            <li><strong>Analytics Providers:</strong> Aggregated usage data from Google Analytics, Cloudflare Analytics, or similar services.</li>
            <li><strong>Advertising Partners:</strong> Ad performance metrics, click-through rates, and impression data from our advertising network.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Service Delivery:</strong> To provide, operate, maintain, and improve our cryptocurrency tracking, portfolio management, and informational services.</li>
            <li><strong>Personalization:</strong> To customize your experience, including language preferences (Roman Urdu, Urdu, Pashto, Sindhi, English), currency settings (USD, PKR), and content recommendations.</li>
            <li><strong>Communication:</strong> To send you important updates, security alerts, support messages, and administrative information.</li>
            <li><strong>Analytics:</strong> To analyze usage patterns, measure advertising effectiveness, and understand how users interact with our platform.</li>
            <li><strong>Security:</strong> To detect, prevent, and address fraud, technical issues, or security threats.</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
            <li><strong>Business Operations:</strong> To manage our business, process transactions, and send related information including confirmations and invoices.</li>
            <li><strong>Marketing:</strong> With your consent, to send promotional communications that may be of interest to you. You can opt out at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Information Sharing and Disclosure</h2>
          <p>We do <strong>not sell</strong> your personal information to third parties. We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Service Providers:</strong> With trusted third-party companies that perform services on our behalf, such as hosting, analytics, email delivery, and payment processing. These providers are contractually obligated to protect your information.</li>
            <li><strong>Advertising Partners:</strong> Aggregated and anonymized data may be shared with advertising partners to serve relevant ads. No personally identifiable information is shared.</li>
            <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of BitcoinUrdu, our users, or the public.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction.</li>
            <li><strong>With Your Consent:</strong> We may share information with third parties when you give us explicit consent to do so.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using HTTPS/TLS protocols.</li>
            <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms limit who can access user data within our organization.</li>
            <li><strong>Data Storage:</strong> Personal data is stored on secure servers with firewalls, intrusion detection, and regular security audits.</li>
            <li><strong>Password Security:</strong> Passwords are hashed and salted using industry-standard algorithms. We never store passwords in plain text.</li>
            <li><strong>Regular Audits:</strong> We conduct regular security assessments and vulnerability scans to identify and address potential weaknesses.</li>
          </ul>
          <p>While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies and Tracking Technologies</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">6.1 Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., session management, security).</li>
            <li><strong>Preference Cookies:</strong> Remember your settings such as language, currency, and theme preferences.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous usage data.</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and measure ad campaign effectiveness.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">6.2 Managing Cookies</h3>
          <p>You can control and manage cookies through your browser settings. Most browsers allow you to refuse or delete cookies. However, disabling certain cookies may affect the functionality of our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide you with our services. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
          <p>When data is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data, subject to certain legal exceptions.</li>
            <li><strong>Portability:</strong> Request a portable copy of your data in a machine-readable format.</li>
            <li><strong>Restriction:</strong> Request that we restrict the processing of your personal data under certain circumstances.</li>
            <li><strong>Objection:</strong> Object to the processing of your personal data for direct marketing or other legitimate interests.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time where we rely on consent to process your data.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@bitcoinurdu.com" className="text-bitcoin hover:underline">privacy@bitcoinurdu.com</a>. We will respond to your request within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Children's Privacy</h2>
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected personal data from a child, we will take steps to delete such information promptly.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Third-Party Links and Services</h2>
          <p>Our platform may contain links to third-party websites, services, or applications that are not operated by us. These include cryptocurrency exchanges, wallet providers, and other external resources. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party services.</p>
          <p>We strongly recommend reviewing the privacy policy of every third-party site you visit before providing any personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">11. International Data Transfers</h2>
          <p>Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that differ from the laws of your country. We ensure that appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by updating the "Last Updated" date at the top of this policy and, where appropriate, by providing a more prominent notice (such as a site banner or email notification).</p>
          <p>We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">13. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:privacy@bitcoinurdu.com" className="text-bitcoin hover:underline">privacy@bitcoinurdu.com</a></li>
            <li><strong>General Inquiries:</strong> <a href="mailto:info@bitcoinurdu.com" className="text-bitcoin hover:underline">info@bitcoinurdu.com</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@bitcoinurdu.com" className="text-bitcoin hover:underline">support@bitcoinurdu.com</a></li>
            <li><strong>Website:</strong> <a href="https://bitcoinurdu.com/contact" className="text-bitcoin hover:underline">bitcoinurdu.com/contact</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
