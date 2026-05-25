'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, ExternalLink, Search, ChevronRight, Bell, Zap, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { JobsAd } from '@/components/ads/ad-slots';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  url: string;
  posted: string;
  remote: boolean;
  pakistan: boolean;
  category: 'govt' | 'private' | 'freelance' | 'crypto';
  deadline?: string;
  active?: boolean;
  hot?: boolean;
  new?: boolean;
  urgent?: boolean;
  vacancies: number;
  qualification: string;
  source: string;
  province: string;
}

const breakingNews = [
  'Punjab Police 5000+ new bhartiyan 2026',
  'FIA Cyber Wing - 200 posts - last date 30 July',
  'Global Army 148 Regular Commission - apply now',
  'Rangers Sindh - 1200 jawan bharti - announcement',
  'NTS Test Dates - FPSC Combined 2026 schedule',
  'IB Intelligence Bureau - 350 ASI posts',
  'WAPDA Junior Engineer - 150 vacancies',
  'HEC Scholarship 2026 - apply online',
];

const departments = [
  { id: 'all', label: 'All Jobs', count: 12840 },
  { id: 'police', label: 'Police', count: 5200 },
  { id: 'army', label: 'Army/Navy/PAF', count: 1800 },
  { id: 'rangers', label: 'Rangers', count: 1200 },
  { id: 'fia', label: 'FIA', count: 350 },
  { id: 'ib', label: 'IB Intelligence', count: 200 },
  { id: 'paf', label: 'PAF', count: 600 },
  { id: 'navy', label: 'Navy', count: 400 },
  { id: 'fpsc', label: 'FPSC', count: 780 },
  { id: 'nts', label: 'NTS/FPSC', count: 920 },
  { id: 'wapda', label: 'WAPDA', count: 350 },
  { id: 'education', label: 'Education', count: 680 },
  { id: 'health', label: 'Health', count: 540 },
  { id: 'banking', label: 'Banking', count: 420 },
];

const provinces = [
  { id: 'all', label: 'All Regions', count: 47 },
  { id: 'punjab', label: 'Punjab', count: 3240 },
  { id: 'sindh', label: 'Sindh', count: 2100 },
  { id: 'kpk', label: 'KPK', count: 1650 },
  { id: 'balochistan', label: 'Balochistan', count: 980 },
  { id: 'islamabad', label: 'Islamabad', count: 1870 },
  { id: 'ajk', label: 'AJK', count: 540 },
  { id: 'gb', label: 'Gilgit-Baltistan', count: 320 },
];

const qualifications = [
  { id: 'all', label: 'All', count: 12840 },
  { id: 'matric', label: 'Matric (10th)', count: 4200 },
  { id: 'inter', label: 'Inter (12th)', count: 2800 },
  { id: 'grad', label: 'BA/BSc Graduate', count: 3100 },
  { id: 'masters', label: 'Masters', count: 1400 },
  { id: 'diploma', label: 'Diploma', count: 890 },
  { id: 'no-exp', label: 'No Experience', count: 2200 },
];

const defaultJobs: Job[] = [
  {
    id: 'g1',
    title: 'Punjab Police Constable 5000+ Jobs',
    department: 'Punjab Police',
    location: 'Lahore, Punjab',
    type: 'Government',
    salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)',
    description: 'Punjab Police Department ne Constable ki 5,000+ vacancies nikali hain. Matric/F.A qualified candidates apply kar sakte hain. Age limit 20-25 years. Physical test aur written test hoga.',
    tags: ['Police', 'BPS-07', 'Punjab', 'Constable'],
    url: 'https://www.punjabpolice.gov.pk',
    posted: 'Today',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '15 June 2026',
    hot: true,
    new: true,
    vacancies: 5000,
    qualification: 'Matric',
    source: 'Express',
    province: 'punjab',
  },
  {
    id: 'g2',
    title: 'FIA Sub-Inspector / ASI 200 Jobs',
    department: 'Federal Investigation Agency',
    location: 'Islamabad / All Regions',
    type: 'Government',
    salary: 'BPS-14/16 (Rs.45,000 - Rs.65,000/month)',
    description: 'FIA ne Sub-Inspector aur ASI ki 200 vacancies nikali hain. Graduate degree required. FPSC ke through selection hoga. Cyber Crime Wing mein bhi vacancies hain.',
    tags: ['FIA', 'BPS-14', 'Federal', 'SI', 'ASI'],
    url: 'https://www.fpsc.gov.pk',
    posted: '1 day ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '30 July 2026',
    hot: true,
    urgent: true,
    vacancies: 200,
    qualification: 'BA/BSc',
    source: 'Express',
    province: 'islamabad',
  },
  {
    id: 'g3',
    title: 'Global Rangers Sindh 1200 Sepoy Jobs',
    department: 'Global Rangers',
    location: 'Karachi, Sindh',
    type: 'Government',
    salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)',
    description: 'Global Rangers Sindh ne Sepoy ki 1200 bharti nikali hai. Matric pass candidates apply karein. Physical fitness test aur medical test hoga.',
    tags: ['Rangers', 'BPS-07', 'Sindh', 'Sepoy'],
    url: 'https://www.rangerssindh.gov.pk',
    posted: '2 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '25 June 2026',
    hot: true,
    new: true,
    vacancies: 1200,
    qualification: 'Matric',
    source: 'Jang',
    province: 'sindh',
  },
  {
    id: 'g4',
    title: 'Global Army 148 Regular Commission',
    department: 'Global Army',
    location: 'All Regions',
    type: 'Government',
    salary: 'BPS-17 (Rs.65,000 - Rs.90,000/month)',
    description: 'Global Army ne 148 Regular Commission ki bharti nikali hai. BA/BSc/MA/MSc required. ISSB test aur medical hoga.',
    tags: ['Army', 'Captain', 'PMA', 'Commission'],
    url: 'https://www.joinpakarmy.gov.pk',
    posted: '3 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '20 July 2026',
    hot: true,
    vacancies: 148,
    qualification: 'BA/BSc',
    source: 'Jang',
    province: 'all',
  },
  {
    id: 'g5',
    title: 'IB Intelligence Bureau 350 ASI Jobs',
    department: 'Intelligence Bureau',
    location: 'Islamabad',
    type: 'Government',
    salary: 'BPS-09 (Rs.35,000 - 50,000/month)',
    description: 'Intelligence Bureau ne ASI ki 350 vacancies nikali hain. Inter pass candidates apply kar sakte hain. Written test aur interview hoga.',
    tags: ['IB', 'ASI', 'Intelligence', 'Federal'],
    url: 'https://www.ib.gov.pk',
    posted: 'Today',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '5 August 2026',
    new: true,
    urgent: true,
    vacancies: 350,
    qualification: 'Inter',
    source: 'Nawaiwaqt',
    province: 'islamabad',
  },
  {
    id: 'g6',
    title: 'PAF GD Pilot / Airman Recruitment',
    department: 'Global Air Force',
    location: 'All Regions',
    type: 'Government',
    salary: 'BPS-07 to BPS-17 (Rs.32,000 - Rs.90,000/month)',
    description: 'PAF ne GD Pilot Course aur Airman ki bharti shuru kar di hai. F.Sc (Pre-Eng/Pre-Med) required for GD Pilot. Matric for Airman. ISSB test aur medical hoga.',
    tags: ['PAF', 'Air Force', 'GD Pilot', 'Airman'],
    url: 'https://www.joinpaf.gov.pk',
    posted: '5 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '10 July 2026',
    vacancies: 600,
    qualification: 'F.Sc',
    source: 'Express',
    province: 'all',
  },
  {
    id: 'g7',
    title: 'Global Navy Sailor / PN Cadet',
    department: 'Global Navy',
    location: 'Karachi',
    type: 'Government',
    salary: 'BPS-07 to BPS-17 (Rs.32,000 - Rs.90,000/month)',
    description: 'Global Navy ne Sailor aur PN Cadet ki bharti nikali hai. Matric to F.Sc required. Physical test, written test aur ISSB hoga.',
    tags: ['Navy', 'Sailor', 'PN Cadet'],
    url: 'https://www.joinpaknavy.gov.pk',
    posted: '1 week ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '15 July 2026',
    vacancies: 400,
    qualification: 'Matric',
    source: 'Jang',
    province: 'sindh',
  },
  {
    id: 'g8',
    title: 'WAPDA Junior Engineer 150 Jobs',
    department: 'WAPDA',
    location: 'All Regions',
    type: 'Government',
    salary: 'BPS-12 (Rs.40,000 - Rs.60,000/month)',
    description: 'WAPDA ne Junior Engineer ki 150 vacancies nikali hain. DAE Electrical/Mechanical required. NTS test ke through selection hoga.',
    tags: ['WAPDA', 'BPS-12', 'Engineer', 'NTS'],
    url: 'https://www.wapda.gov.pk',
    posted: '4 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '28 June 2026',
    new: true,
    vacancies: 150,
    qualification: 'DAE',
    source: 'Express',
    province: 'all',
  },
  {
    id: 'g9',
    title: 'FPSC Combined Competitive Exam 2026',
    department: 'FPSC',
    location: 'Islamabad',
    type: 'Government',
    salary: 'BPS-17 (Rs.65,000 - Rs.90,000/month)',
    description: 'FPSC ne Combined Competitive Exam 2026 ka schedule jari kar diya hai. 780+ vacancies hain. BA/BSc required. Written exam aur interview hoga.',
    tags: ['FPSC', 'CSS', 'BPS-17', 'Federal'],
    url: 'https://www.fpsc.gov.pk',
    posted: '6 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '15 August 2026',
    vacancies: 780,
    qualification: 'BA/BSc',
    source: 'Dawn',
    province: 'islamabad',
  },
  {
    id: 'g10',
    title: 'NTS Test Schedule 2026 - Multiple Departments',
    department: 'NTS',
    location: 'All Regions',
    type: 'Government',
    salary: 'BPS-07 to BPS-17',
    description: 'NTS ne 2026 ke multiple tests ka schedule jari kar diya hai. Education, Health, aur Police departments mein vacancies hain.',
    tags: ['NTS', 'Test', 'Multiple', 'Government'],
    url: 'https://www.nts.org.pk',
    posted: 'Today',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '30 August 2026',
    new: true,
    urgent: true,
    vacancies: 920,
    qualification: 'Matric to Masters',
    source: 'Express',
    province: 'all',
  },
  {
    id: 'g11',
    title: 'Sindh Police Constable 3000+ Jobs',
    department: 'Sindh Police',
    location: 'Karachi, Sindh',
    type: 'Government',
    salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)',
    description: 'Sindh Police ne Constable ki 3000+ vacancies nikali hain. Matric pass candidates apply kar sakte hain. Physical test aur written test hoga.',
    tags: ['Police', 'BPS-07', 'Sindh', 'Constable'],
    url: 'https://www.sindhpolice.gov.pk',
    posted: '2 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '20 July 2026',
    hot: true,
    vacancies: 3000,
    qualification: 'Matric',
    source: 'Jang',
    province: 'sindh',
  },
  {
    id: 'g12',
    title: 'KPK Police 2000+ Bharti 2026',
    department: 'KPK Police',
    location: 'Peshawar, KPK',
    type: 'Government',
    salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)',
    description: 'KPK Police ne Constable aur Driver ki 2000+ vacancies nikali hain. Matric pass candidates apply kar sakte hain.',
    tags: ['Police', 'BPS-07', 'KPK', 'Constable'],
    url: 'https://www.kppolice.gov.pk',
    posted: '3 days ago',
    remote: false,
    pakistan: true,
    category: 'govt',
    deadline: '25 July 2026',
    vacancies: 2000,
    qualification: 'Matric',
    source: 'Express',
    province: 'kpk',
  },
];

export default function JobsClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedQual, setSelectedQual] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'vacancies'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [emailAlert, setEmailAlert] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const perPage = 6;

  useEffect(() => {
    setJobs(defaultJobs);
    setLoading(false);
  }, []);

  let filtered = jobs.filter((job) => {
    if (job.active === false) return false;
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchDept = selectedDept === 'all' || job.department.toLowerCase().includes(selectedDept);
    const matchProvince = selectedProvince === 'all' || job.province === selectedProvince;
    const matchQual = selectedQual === 'all' || job.qualification.toLowerCase().includes(selectedQual);

    return matchSearch && matchDept && matchProvince && matchQual;
  });

  if (sortBy === 'deadline') {
    filtered = [...filtered].sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
  } else if (sortBy === 'vacancies') {
    filtered = [...filtered].sort((a, b) => b.vacancies - a.vacancies);
  } else {
    filtered = [...filtered].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const pagedJobs = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSubscribe = async () => {
    if (!emailAlert) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscribe', email: emailAlert }),
      });
      setSubscribed(true);
      setEmailAlert('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* BREAKING NEWS */}
      <div className="bg-red-600 text-white rounded-lg overflow-hidden">
        <div className="flex items-center">
          <div className="bg-red-700 px-3 py-2 font-bold text-xs whitespace-nowrap flex items-center gap-1">
            <Zap className="h-3 w-3" />
            BREAKING
          </div>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap py-2 px-3 text-xs">
              {breakingNews.map((news, i) => (
                <span key={i} className="mr-8">{news}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <JobsAd className="my-4" />

      {/* SEARCH & STATS */}
      <div className="space-y-3 py-2">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs... Police, Army, FIA, Rangers"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
          />
        </div>

        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span>Today's Jobs: <strong className="text-foreground">{jobs.filter(j => j.posted === 'Today').length || 47}</strong></span>
          <span>Total Posts: <strong className="text-foreground">12,840</strong></span>
        </div>
      </div>

      {/* DEPARTMENT FILTERS */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => { setSelectedDept(dept.id); setCurrentPage(1); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedDept === dept.id
                ? 'bg-bitcoin text-white shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* PROVINCE + QUALIFICATION */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Province</p>
            <div className="grid grid-cols-2 gap-1">
              {provinces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvince(p.id); setCurrentPage(1); }}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-all ${
                    selectedProvince === p.id
                      ? 'bg-bitcoin/10 border border-bitcoin text-bitcoin'
                      : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  <span className="text-[10px] text-muted-foreground">{p.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Qualification</p>
            <div className="grid grid-cols-2 gap-1">
              {qualifications.map((q) => (
                <button
                  key={q.id}
                  onClick={() => { setSelectedQual(q.id); setCurrentPage(1); }}
                  className={`flex items-center justify-between p-1.5 rounded text-xs transition-all ${
                    selectedQual === q.id
                      ? 'bg-bitcoin/10 border border-bitcoin text-bitcoin'
                      : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <span className="truncate">{q.label}</span>
                  <span className="text-[10px] text-muted-foreground">{q.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EMAIL ALERTS */}
      <Card className="border-bitcoin/30 bg-bitcoin/5">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-bitcoin shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium">Job Alerts</p>
              <p className="text-[10px] text-muted-foreground">Get notified when new jobs are posted</p>
            </div>
            {subscribed ? (
              <Badge variant="green" className="text-[10px]">Subscribed!</Badge>
            ) : (
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email"
                  value={emailAlert}
                  onChange={(e) => setEmailAlert(e.target.value)}
                  className="px-2 py-1.5 rounded text-xs border bg-background w-28"
                />
                <Button size="sm" variant="bitcoin" className="h-7 text-xs px-2" onClick={handleSubscribe}>Subscribe</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* JOB LISTINGS */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4"><div className="h-4 w-40 bg-muted rounded mb-2" /><div className="h-3 w-24 bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          {/* SORT + COUNT */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{filtered.length} results found</p>
            <div className="flex gap-1">
              <button onClick={() => setSortBy('newest')} className={`px-2 py-1 text-[10px] rounded ${sortBy === 'newest' ? 'bg-bitcoin text-white' : 'bg-muted hover:bg-accent'}`}>Newest</button>
              <button onClick={() => setSortBy('deadline')} className={`px-2 py-1 text-[10px] rounded ${sortBy === 'deadline' ? 'bg-bitcoin text-white' : 'bg-muted hover:bg-accent'}`}>Deadline</button>
              <button onClick={() => setSortBy('vacancies')} className={`px-2 py-1 text-[10px] rounded ${sortBy === 'vacancies' ? 'bg-bitcoin text-white' : 'bg-muted hover:bg-accent'}`}>Vacancies</button>
            </div>
          </div>

          {/* JOBS + AD SLOT */}
          <div className="space-y-3">
            {pagedJobs.map((job, index) => (
              <div key={job.id}>
                <Card className="hover:shadow-md transition-all border-l-4 border-l-bitcoin/40">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold">{job.title}</h3>
                              {job.hot && <Badge variant="red" className="text-[10px] px-1.5 py-0">HOT</Badge>}
                              {job.new && <Badge variant="green" className="text-[10px] px-1.5 py-0">NEW</Badge>}
                              {job.urgent && <Badge variant="bitcoin" className="text-[10px] px-1.5 py-0">URGENT</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.department}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.vacancies} vacancies
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.posted}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-[10px]">{job.province}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{job.qualification}</Badge>
                          {job.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                          ))}
                        </div>

                        {job.deadline && (
                          <p className="text-xs text-red-500 font-medium">
                            Deadline: {job.deadline}
                            {job.urgent && ' (Closing soon)'}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground">Source: {job.source}</p>
                        <p className="text-xs font-semibold text-crypto-green">Salary: {job.salary}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <Button variant="bitcoin" size="sm" asChild className="whitespace-nowrap text-xs h-7">
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            Apply Now
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* AD SLOT IN MIDDLE */}
                {index === 2 && (
                  <div className="my-2">
                    <JobsAd className="my-2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs rounded border disabled:opacity-50 hover:bg-muted"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-2 py-1 text-xs rounded border ${currentPage === p ? 'bg-bitcoin text-white border-bitcoin' : 'hover:bg-muted'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs rounded border disabled:opacity-50 hover:bg-muted"
              >
                <ChevronRightIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-sm font-semibold mb-1">No jobs found</h3>
                <p className="text-xs text-muted-foreground">Try changing your search or filters.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* POST JOB CTA */}
      <Card className="border-bitcoin/30 bg-bitcoin/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-semibold">Want to post a job?</h3>
              <p className="text-xs text-muted-foreground">Publish your job listing on our platform.</p>
            </div>
            <Button variant="bitcoin" size="sm" asChild className="text-xs">
              <Link href="/advertise">
                Advertise With Us
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
