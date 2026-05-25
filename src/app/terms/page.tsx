import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Terms of Service' });

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing, browsing, or using BitcoinUrdu.com ("the Website," "we," "our," or "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and BitcoinUrdu.</p>
          <p>If you do not agree to these Terms, you must not access or use our Website, services, or any content provided through the platform. Your continued use of the Website following any changes to these Terms constitutes your acceptance of those changes.</p>
          <p>You must be at least 18 years old to use our services. By using this Website, you represent and warrant that you are of legal age to form a binding contract and meet all eligibility requirements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Services</h2>
          <p>BitcoinUrdu provides the following services and features:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Cryptocurrency Information:</strong> Real-time and historical data on cryptocurrency prices, market capitalization, trading volume, and related metrics sourced from public APIs such as CoinGecko.</li>
            <li><strong>Portfolio Tracking:</strong> Tools to track your cryptocurrency holdings, monitor performance, and manage your investment portfolio.</li>
            <li><strong>Airdrop Tracking:</strong> Information about current, upcoming, and ended cryptocurrency airdrops, including eligibility criteria and claiming instructions.</li>
            <li><strong>Token Unlocks:</strong> Data on upcoming token unlock events, including dates, amounts, and potential market impact.</li>
            <li><strong>Market Data:</strong> Information on stocks, forex, commodities, and global market indices for informational purposes.</li>
            <li><strong>Educational Content:</strong> Articles, guides, and resources about Bitcoin, blockchain technology, and cryptocurrency.</li>
            <li><strong>AI-Powered Chat:</strong> An AI chatbot that provides information and answers questions related to cryptocurrency and blockchain.</li>
            <li><strong>Mining Hardware Comparison:</strong> Real-time mining profitability data, hardware specifications comparison, network difficulty tracking from Mempool.space, and interactive profitability calculators for ASIC and GPU miners.</li>
            <li><strong>Gas Fee Tracker:</strong> Real-time gas fee monitoring for Ethereum, BSC, and Polygon networks sourced from Etherscan, BscScan, and Polygonscan APIs.</li>
            <li><strong>Crypto Tools:</strong> A suite of calculators and tools including DCA calculator, compound interest calculator, ROI calculator, crypto converter, wallet tracker, token approval checker, rug check, bridge finder, whale tracker, and fear & greed index.</li>
            <li><strong>Jobs Board:</strong> Listings of cryptocurrency, blockchain, and related job opportunities.</li>
            <li><strong>Blog and News:</strong> Editorial content, analysis, and news articles related to the cryptocurrency industry.</li>
            <li><strong>Alerts and Notifications:</strong> Price alerts, market notifications, and other customizable alerts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts and Registration</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">3.1 Account Creation</h3>
          <p>To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>

          <h3 className="text-lg font-medium mt-4 mb-2">3.2 Account Security</h3>
          <p>You are responsible for safeguarding the password and any other credentials used to access your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities.</p>
          <p>You must immediately notify us of any unauthorized use of your account or any other breach of security by contacting <a href="mailto:support@bitcoinurdu.com" className="text-bitcoin hover:underline">support@bitcoinurdu.com</a>.</p>

          <h3 className="text-lg font-medium mt-4 mb-2">3.3 Account Termination</h3>
          <p>We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to violation of these Terms, suspected fraudulent activity, or prolonged inactivity.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Acceptable Use and User Conduct</h2>
          <p>When using our services, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violate any applicable law, regulation, or third-party rights.</li>
            <li>Use the services for any illegal, fraudulent, or harmful purpose.</li>
            <li>Attempt to gain unauthorized access to our systems, servers, or networks.</li>
            <li>Use automated means (bots, scrapers, spiders) to access the Website without our prior written consent.</li>
            <li>Interfere with or disrupt the integrity or performance of the services.</li>
            <li>Transmit any viruses, malware, or other malicious code.</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with a person or entity.</li>
            <li>Collect or harvest any personal information from other users.</li>
            <li>Use the portfolio tracker or any data from our platform as the sole basis for financial decisions.</li>
            <li>Engage in any activity that could damage, disable, or impair the Website or interfere with other users' experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property Rights</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">5.1 Our Content</h3>
          <p>All content on BitcoinUrdu, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the design, selection, and arrangement thereof, is the property of BitcoinUrdu or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>

          <h3 className="text-lg font-medium mt-4 mb-2">5.2 User-Generated Content</h3>
          <p>By submitting content to our platform (including comments, reviews, or other contributions), you grant BitcoinUrdu a non-exclusive, worldwide, royalty-free, perpetual, and irrevocable license to use, reproduce, modify, adapt, publish, and distribute such content in any media.</p>

          <h3 className="text-lg font-medium mt-4 mb-2">5.3 Restrictions</h3>
          <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from our Website without our prior written consent, except as generally and ordinarily permitted through the normal functionality of the services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Disclaimer of Warranties</h2>
          <p>THE SERVICES AND ALL CONTENT PROVIDED ON BITCOINURDU ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, BITCOINURDU DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
            <li>ANY WARRANTY THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS.</li>
            <li>ANY WARRANTY REGARDING THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF ANY INFORMATION, DATA, OR CONTENT.</li>
            <li>ANY WARRANTY THAT THE SERVICES WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS.</li>
          </ul>
          <p>WE DO NOT WARRANT THAT THE RESULTS OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE. MARKET DATA, PRICES, AND OTHER INFORMATION MAY BE DELAYED, INACCURATE, OR OUTDATED.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL BITCOINURDU, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.</li>
            <li>FINANCIAL LOSSES OR INVESTMENT LOSSES RESULTING FROM THE USE OF OUR SERVICES.</li>
            <li>ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND ANY PERSONAL INFORMATION STORED THEREIN.</li>
            <li>ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES.</li>
            <li>ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE SERVICES.</li>
          </ul>
          <p>THE TOTAL AGGREGATE LIABILITY OF BITCOINURDU TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED US DOLLARS (USD $100), WHICHEVER IS GREATER.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless BitcoinUrdu and its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses arising from:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your use of and access to the services.</li>
            <li>Your violation of any term of these Terms.</li>
            <li>Your violation of any third-party right, including any intellectual property right or privacy right.</li>
            <li>Any claim that your content caused damage to a third party.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Third-Party Services and Links</h2>
          <p>Our services may contain links to third-party websites, services, or applications that are not owned or controlled by BitcoinUrdu. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>
          <p>You acknowledge and agree that BitcoinUrdu shall not be responsible or liable, directly or indirectly, for any damage or loss caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such third-party websites or services.</p>
          <p>We encourage you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Advertising and Sponsored Content</h2>
          <p>Our Website may display advertisements and sponsored content. We are not responsible for the accuracy, legality, or decency of any advertisements or sponsored content. Your interactions with advertisers are solely between you and the advertiser.</p>
          <p>By purchasing advertising space on BitcoinUrdu, you agree to our advertising terms and conditions, which are available upon request at <a href="mailto:ads@bitcoinurdu.com" className="text-bitcoin hover:underline">ads@bitcoinurdu.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Modifications to Services and Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify, suspend, or discontinue the services (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the services.</p>
          <p>We may revise these Terms at any time by updating this page. By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Governing Law and Dispute Resolution</h2>
          <p>These Terms shall be governed by and construed in accordance with international law, without regard to its conflict of law provisions.</p>
          <p>Any dispute arising out of or relating to these Terms or the services shall first be attempted to be resolved through good-faith negotiation. If the dispute cannot be resolved through negotiation, it shall be submitted to the exclusive jurisdiction of international arbitration courts.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">13. Severability</h2>
          <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent, and the remaining provisions of the Terms will continue in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">14. Entire Agreement</h2>
          <p>These Terms, together with our Privacy Policy, Disclaimer, and any other legal notices published by us on the Website, constitute the entire agreement between you and BitcoinUrdu concerning our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">15. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:legal@bitcoinurdu.com" className="text-bitcoin hover:underline">legal@bitcoinurdu.com</a></li>
            <li><strong>General:</strong> <a href="mailto:info@bitcoinurdu.com" className="text-bitcoin hover:underline">info@bitcoinurdu.com</a></li>
            <li><strong>Website:</strong> <a href="https://bitcoinurdu.com/contact" className="text-bitcoin hover:underline">bitcoinurdu.com/contact</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
