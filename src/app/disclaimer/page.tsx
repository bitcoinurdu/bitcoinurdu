import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({ title: 'Disclaimer' });

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. General Disclaimer</h2>
          <p>The information provided on BitcoinUrdu.com ("the Website") is for <strong>general informational and educational purposes only</strong>. All content on this Website, including text, graphics, images, data, market prices, analysis, articles, blog posts, AI-generated responses, and any other material, is published in good faith and for general information purposes.</p>
          <p><strong>Nothing on this Website constitutes financial advice, investment advice, trading advice, or any other form of professional advice.</strong> BitcoinUrdu is not a licensed financial advisor, broker, dealer, or investment manager. We do not provide personalized investment recommendations or recommendations to buy, sell, or hold any cryptocurrency, security, or other financial instrument.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. No Financial or Investment Advice</h2>
          <p>All content on BitcoinUrdu, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cryptocurrency prices, market data, and charts</li>
            <li>Portfolio tracking tools and performance metrics</li>
            <li>Market analysis, predictions, and commentary</li>
            <li>Educational articles, guides, and tutorials</li>
            <li>AI chatbot responses and recommendations</li>
            <li>Airdrop information and eligibility details</li>
            <li>Token unlock schedules and data</li>
            <li>Stock, forex, and commodity market information</li>
            <li>News articles and editorial content</li>
          </ul>
          <p>...is provided <strong>SOLELY FOR INFORMATIONAL PURPOSES</strong> and should NOT be interpreted as a recommendation, solicitation, endorsement, or offer to buy, sell, or hold any cryptocurrency, security, financial product, or instrument.</p>
          <p><strong>BitcoinUrdu does not guarantee any returns, profits, or specific outcomes from any investment or trading activity.</strong> Past performance of any cryptocurrency, asset, or investment strategy is not indicative of future results.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Investment Risks</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">3.1 Cryptocurrency Risks</h3>
          <p>Cryptocurrency investments carry <strong>significant and substantial risk</strong>. You should be aware of the following risks before engaging in cryptocurrency-related activities:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Volatility:</strong> Cryptocurrency prices can fluctuate wildly in short periods. Prices can drop to zero, and you may lose your entire investment.</li>
            <li><strong>Regulatory Risk:</strong> Government regulations regarding cryptocurrencies are evolving and may significantly impact the value and legality of crypto assets in your jurisdiction.</li>
            <li><strong>Security Risk:</strong> Cryptocurrency holdings are vulnerable to hacking, theft, fraud, and loss of private keys. There is no central authority to reverse transactions or recover lost funds.</li>
            <li><strong>Liquidity Risk:</strong> Some cryptocurrencies may have limited trading volume, making it difficult to buy or sell at desired prices.</li>
            <li><strong>Technology Risk:</strong> Software bugs, network failures, protocol changes, and hard forks can affect the value and functionality of cryptocurrencies.</li>
            <li><strong>Market Manipulation:</strong> The cryptocurrency market is susceptible to manipulation, including pump-and-dump schemes, wash trading, and other fraudulent activities.</li>
            <li><strong>Project Risk:</strong> Many cryptocurrency projects may fail, be abandoned by developers, or turn out to be scams.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">3.2 General Investment Warning</h3>
          <p><strong>NEVER invest more than you can afford to lose.</strong> Cryptocurrency and other digital asset investments are speculative and carry a high level of risk. You should carefully consider your financial situation, investment objectives, and risk tolerance before making any investment decisions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Accuracy of Information</h2>
          <p>While BitcoinUrdu strives to provide accurate, up-to-date, and reliable information, we <strong>do not guarantee</strong> the completeness, accuracy, reliability, suitability, or availability of any information on this Website.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Market Data:</strong> Cryptocurrency prices, market capitalizations, trading volumes, and other market data are sourced from third-party APIs (primarily CoinGecko). This data may be delayed, inaccurate, or subject to errors. We do not verify the accuracy of data provided by third-party sources.</li>
            <li><strong>Timeliness:</strong> Information on this Website may not reflect the most current market conditions. Prices and data can change rapidly and without notice.</li>
            <li><strong>AI-Generated Content:</strong> Responses from our AI chatbot are generated based on patterns in training data and may contain inaccuracies, outdated information, or hallucinations. Always verify AI-generated information independently.</li>
            <li><strong>Editorial Content:</strong> Articles, blog posts, and news content represent the opinions of their authors and may contain subjective analysis, opinions, or errors.</li>
            <li><strong>Typographical Errors:</strong> The Website may contain typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors at any time without notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Mining Profitability Data Disclaimer</h2>
          <p>BitcoinUrdu provides mining hardware comparison, profitability calculators, and real-time earning estimates (collectively "Mining Data"). The following additional disclaimers apply specifically to Mining Data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Estimated Only:</strong> All profitability figures (daily, monthly, yearly gross/net earnings, payback periods) are <strong>estimates only</strong>. They are calculated using the formula: (hashrate × 86400 × block reward) ÷ (network difficulty × 2³²) × coin price − electricity cost.</li>
            <li><strong>Dynamic Factors:</strong> Mining profitability depends on numerous real-time variables including network difficulty adjustments (every 2016 blocks for Bitcoin), coin price volatility, block reward halvings, pool fees (typically 1-4%), hardware efficiency variations, and ambient temperature affecting cooling costs.</li>
            <li><strong>Live Data Limitations:</strong> Our live data is sourced from Mempool.space (BTC difficulty) and CoinGecko (prices). Difficulty data for non-BTC coins uses reference fallback values and may not reflect current network conditions. Data refreshes every 2 minutes and may be delayed.</li>
            <li><strong>Hardware Prices:</strong> Hardware costs displayed are manufacturer MSRP or estimated market prices. Actual retail prices vary by vendor, region, availability, and import duties. "Starting from" prices are indicative only.</li>
            <li><strong>Electricity Cost:</strong> Default electricity rate is $0.08/kWh. Your actual rate may be higher or lower. Use the calculator slider to adjust for your local electricity cost.</li>
            <li><strong>No Purchase Recommendations:</strong> Mining profitability data should NOT be interpreted as a recommendation to purchase any specific mining hardware. Always conduct your own research, compare prices across multiple vendors, and consider total cost of ownership including shipping, setup, maintenance, and facility costs.</li>
            <li><strong>Hardware Specifications:</strong> Miner specifications (hashrate, power consumption, efficiency) are sourced from manufacturer datasheets and third-party references. Actual performance may vary due to firmware, overclocking/undervolting, ambient conditions, and unit-to-unit variation.</li>
          </ul>
          <p><strong>Mining is inherently speculative and carries significant financial risk.</strong> Network difficulty increases, coin price drops, regulatory changes, and hardware obsolescence can rapidly eliminate profitability. Never purchase mining hardware based solely on data from this platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Portfolio Tracker Disclaimer</h2>
          <p>Our portfolio tracking tool is provided as a <strong>personal management utility only</strong>. The following disclaimers apply:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Portfolio values, profit/loss calculations, and performance metrics are estimates based on third-party market data and may not reflect actual realizable values.</li>
            <li>The portfolio tracker does not connect to any exchange, wallet, or blockchain. All data is manually entered by the user.</li>
            <li>We are not responsible for any discrepancies between portfolio tracker values and actual portfolio values.</li>
            <li>Portfolio data is stored locally or on our servers and is not guaranteed to be secure or permanently available.</li>
            <li>Always verify your actual holdings through your exchange accounts, wallet balances, and blockchain explorers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Airdrop Information Disclaimer</h2>
          <p>Information about cryptocurrency airdrops on BitcoinUrdu is provided for informational purposes only. We:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Do not guarantee the legitimacy, safety, or value of any airdrop listed on our platform.</li>
            <li>Do not endorse or recommend participation in any airdrop.</li>
            <li>Are not responsible for any losses, scams, or security compromises resulting from participation in airdrops.</li>
            <li>Do not verify the authenticity of airdrop projects beyond basic research.</li>
          </ul>
          <p><strong>Always conduct thorough independent research (DYOR — Do Your Own Research) before participating in any airdrop.</strong> Be cautious of airdrops that require you to send funds, share private keys, or connect your wallet to unverified smart contracts.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Third-Party Links and Services</h2>
          <p>BitcoinUrdu may contain links to third-party websites, services, applications, and resources, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cryptocurrency exchanges and trading platforms</li>
            <li>Wallet providers and blockchain explorers</li>
            <li>DeFi protocols and decentralized applications</li>
            <li>News sources, blogs, and social media platforms</li>
            <li>Job listing websites and company career pages</li>
            <li>Advertising and sponsored content</li>
          </ul>
          <p><strong>BitcoinUrdu has no control over and assumes no responsibility for the content, accuracy, privacy policies, security practices, or business practices of any third-party websites or services.</strong> The inclusion of any link does not imply endorsement, approval, or recommendation by BitcoinUrdu.</p>
          <p>You access third-party websites and services at your own risk. We strongly recommend reviewing the terms of service and privacy policies of any third-party site before providing personal information or engaging in transactions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Forward-Looking Statements</h2>
          <p>Some content on BitcoinUrdu may contain forward-looking statements, including predictions, projections, opinions, and forecasts about cryptocurrency prices, market trends, technology developments, and regulatory changes. These statements are based on current expectations and assumptions that are subject to risks and uncertainties.</p>
          <p><strong>Actual results may differ materially from those expressed or implied in forward-looking statements.</strong> BitcoinUrdu undertakes no obligation to update or revise any forward-looking statements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Jurisdictional Restrictions</h2>
          <p>Cryptocurrency regulations vary by country and jurisdiction. It is your responsibility to ensure that your use of cryptocurrency-related services complies with the laws and regulations applicable in your jurisdiction.</p>
          <p>Some jurisdictions restrict or prohibit cryptocurrency trading, holding, or certain types of transactions. BitcoinUrdu does not provide legal advice regarding the legality of cryptocurrency activities in any specific jurisdiction.</p>
          <p><strong>Users are solely responsible for determining whether their use of the services and engagement in cryptocurrency activities is legal in their jurisdiction.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Tax Implications</h2>
          <p>Cryptocurrency transactions may have tax implications in your jurisdiction. BitcoinUrdu does not provide tax advice. You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Understanding and complying with tax laws applicable to your cryptocurrency activities.</li>
            <li>Reporting cryptocurrency transactions, gains, losses, and income to the appropriate tax authorities.</li>
            <li>Consulting with a qualified tax professional regarding your specific tax situation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Limitation of Liability</h2>
          <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BITCOINURDU, ITS OWNERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>YOUR USE OF OR INABILITY TO USE THE WEBSITE OR SERVICES.</li>
            <li>ANY FINANCIAL LOSSES, INVESTMENT LOSSES, OR TRADING LOSSES.</li>
            <li>ANY ERRORS, INACCURACIES, OR OMISSIONS IN THE CONTENT.</li>
            <li>ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND PERSONAL INFORMATION.</li>
            <li>ANY INTERRUPTION, DELAY, OR CESSATION OF THE SERVICES.</li>
            <li>ANY ACTIONS, DECISIONS, OR TRANSACTIONS YOU MAKE BASED ON INFORMATION FROM THIS WEBSITE.</li>
            <li>ANY THIRD-PARTY CONTENT, WEBSITES, OR SERVICES ACCESSED THROUGH THE WEBSITE.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">13. Do Your Own Research (DYOR)</h2>
          <p><strong>WE CANNOT EMPHASIZE THIS ENOUGH: ALWAYS CONDUCT YOUR OWN THOROUGH RESEARCH BEFORE MAKING ANY INVESTMENT, TRADING, OR FINANCIAL DECISIONS.</strong></p>
          <p>BitcoinUrdu is an informational platform. We provide data, tools, and content to help you make informed decisions, but the ultimate responsibility for any decision you make rests solely with you. Never rely on a single source of information.</p>
          <p>Consult with licensed financial advisors, conduct independent research, read whitepapers, verify information across multiple sources, and understand the risks before committing any funds.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">14. Changes to This Disclaimer</h2>
          <p>We may update, modify, or revise this Disclaimer at any time without prior notice. Any changes will be effective immediately upon posting to the Website. Your continued use of the Website after any changes constitutes your acceptance of the revised Disclaimer.</p>
          <p>We encourage you to review this Disclaimer periodically to stay informed about our disclaimers and limitations of liability.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">15. Contact Us</h2>
          <p>If you have any questions or concerns about this Disclaimer, please contact us:</p>
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
