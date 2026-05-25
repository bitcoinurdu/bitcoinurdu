'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { cn } from '@/lib/utils/helpers';
import { BookText, Search, ChevronDown, ChevronUp } from 'lucide-react';

const glossaryTerms = [
  { term: 'ATH (All-Time High)', definition: 'The highest price ever reached by a cryptocurrency in its trading history.' },
  { term: 'ATL (All-Time Low)', definition: 'The lowest price ever reached by a cryptocurrency in its trading history.' },
  { term: 'APR (Annual Percentage Rate)', definition: 'The annual rate of interest earned on crypto deposits or paid on loans, without compounding.' },
  { term: 'APY (Annual Percentage Yield)', definition: 'The effective annual rate of return including the effect of compound interest.' },
  { term: 'Blockchain', definition: 'A decentralized, distributed digital ledger that records transactions across many computers.' },
  { term: 'Bitcoin', definition: 'The first and most well-known cryptocurrency, created by Satoshi Nakamoto in 2009.' },
  { term: 'DeFi (Decentralized Finance)', definition: 'Financial services built on blockchain without intermediaries like banks or brokers.' },
  { term: 'DEX (Decentralized Exchange)', definition: 'A peer-to-peer exchange where users trade cryptocurrencies directly without a central authority.' },
  { term: 'CEX (Centralized Exchange)', definition: 'A crypto exchange operated by a company that acts as an intermediary between buyers and sellers.' },
  { term: 'DAO (Decentralized Autonomous Organization)', definition: 'An organization represented by rules encoded as smart contracts, controlled by token holders.' },
  { term: 'DYOR (Do Your Own Research)', definition: 'A common crypto community phrase encouraging investors to research before investing.' },
  { term: 'FOMO (Fear Of Missing Out)', definition: 'An emotional response where investors buy assets due to fear of missing potential gains.' },
  { term: 'FUD (Fear, Uncertainty, Doubt)', definition: 'Negative or misleading information spread to create fear and doubt about a crypto project.' },
  { term: 'Gas', definition: 'A fee required to execute transactions on blockchain networks like Ethereum.' },
  { term: 'Halving', definition: 'An event that cuts the block reward for Bitcoin mining in half, occurring approximately every four years.' },
  { term: 'HODL', definition: 'A crypto slang term meaning "Hold On for Dear Life" — holding crypto long-term regardless of price.' },
  { term: 'KYC (Know Your Customer)', definition: 'The process of verifying a user\'s identity, required by most regulated exchanges.' },
  { term: 'Layer 2', definition: 'A secondary protocol built on top of a blockchain to improve scalability and transaction speed.' },
  { term: 'Liquidity', definition: 'The ability to quickly buy or sell an asset without significantly affecting its price.' },
  { term: 'Mining', definition: 'The process of validating transactions and adding blocks to a blockchain using computational power.' },
  { term: 'NFT (Non-Fungible Token)', definition: 'A unique digital asset representing ownership of a specific item like art, music, or collectibles.' },
  { term: 'Oracle', definition: 'A service that brings real-world data onto the blockchain for smart contracts to use.' },
  { term: 'PoW (Proof of Work)', definition: 'A consensus mechanism where miners solve complex puzzles to validate transactions.' },
  { term: 'PoS (Proof of Stake)', definition: 'A consensus mechanism where validators stake tokens to secure the network.' },
  { term: 'RWA (Real World Assets)', definition: 'Tokenized representations of physical assets like real estate, commodities, or bonds on blockchain.' },
  { term: 'Stablecoin', definition: 'A cryptocurrency designed to maintain a stable value by being pegged to a reserve asset like USD.' },
  { term: 'Token', definition: 'A digital asset built on an existing blockchain representing value, utility, or ownership.' },
  { term: 'Wallet', definition: 'Software or hardware used to store, send, and receive cryptocurrencies securely.' },
  { term: 'Whitepaper', definition: 'A document that explains the purpose, technology, and economics of a crypto project.' },
  { term: 'Yield Farming', definition: 'A DeFi strategy where users lend or stake crypto to earn rewards, typically in the form of tokens.' },
  { term: 'Zero-Knowledge Proof', definition: 'A cryptographic method allowing one party to prove knowledge of information without revealing the information itself.' },
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((t) => {
      const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesLetter = activeLetter ? t.term[0].toUpperCase() === activeLetter : true;
      return matchesSearch && matchesLetter;
    });
  }, [search, activeLetter]);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-2">
            <BookText className="h-4 w-4 text-bitcoin" />
            Crypto Dictionary
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Crypto Glossary
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand every crypto term with clear, simple definitions. From ATH to Zero-Knowledge Proofs.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search glossary terms..."
              className="pl-10 h-12 text-base"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
            />
          </div>
        </section>

        <AdPlaceholder size="banner" className="my-8" />

        <section className="space-y-6">
          <div className="flex flex-wrap justify-center gap-1.5">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setActiveLetter(activeLetter === letter ? null : letter);
                  setSearch('');
                }}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-medium transition-all border',
                  activeLetter === letter
                    ? 'bg-bitcoin text-white border-bitcoin shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:border-bitcoin/40 hover:text-bitcoin'
                )}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {activeLetter ? `Showing terms starting with "${activeLetter}"` : 'Showing all terms'}
            {search && ` — matching "${search}"`}
            <span className="ml-1">({filteredTerms.length} terms)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTerms.map((item) => (
              <Card
                key={item.term}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:shadow-md',
                  expanded === item.term ? 'border-bitcoin/40' : ''
                )}
                onClick={() => setExpanded(expanded === item.term ? null : item.term)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full bg-bitcoin/60" />
                      <CardTitle className="text-base">{item.term}</CardTitle>
                    </div>
                    {expanded === item.term ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className={cn(
                  'overflow-hidden transition-all duration-200',
                  expanded === item.term ? 'max-h-48 pb-4' : 'max-h-0 pb-0'
                )}>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
                  <Badge variant="secondary" className="mt-3 text-xs">
                    {item.term[0].toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16 space-y-2">
              <BookText className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">No terms found</p>
              <p className="text-sm text-muted-foreground/60">Try a different search or letter filter</p>
            </div>
          )}
        </section>

        <AdPlaceholder size="rectangle" className="my-8" />
      </div>
    </main>
  );
}
