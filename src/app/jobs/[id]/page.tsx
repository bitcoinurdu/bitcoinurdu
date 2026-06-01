import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin, Clock, Calendar, ChevronLeft, ChevronRight, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';

const tutorialSteps = [
  { title: 'Online Application', desc: 'Official website par jayen aur online form bharen. Required documents scan karke upload karein.' },
  { title: 'Admit Card', desc: 'Test se 2 hafte pehle admit card download hoga. Usme test date, time aur venue hoga.' },
  { title: 'Written Test', desc: 'MCQs-based written test hoga. Subjects: General Knowledge, Math, English, aur subject-specific questions.' },
  { title: 'Physical Test', desc: 'Police aur Army jobs mein physical fitness test hota hai including running, push-ups, aur height measurement.' },
  { title: 'Interview', desc: 'Final stage mein panel interview hoga. Apne original documents aur certificates sath laye.' },
];

interface Job {
  id: string; title: string; department: string; location: string; type: string;
  salary: string; description: string; tags: string[]; url: string; posted: string;
  remote: boolean; pakistan: boolean; category: string; deadline?: string;
  active?: boolean; hot?: boolean; new?: boolean; urgent?: boolean;
  vacancies: number; qualification: string; source: string; province: string;
}

const allJobs: Job[] = [
  { id: 'g1', title: 'Punjab Police Constable 5000+ Jobs', department: 'Punjab Police', location: 'Lahore, Punjab', type: 'Government', salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)', description: 'Punjab Police Department ne Constable ki 5,000+ vacancies nikali hain. Matric/F.A qualified candidates apply kar sakte hain. Age limit 20-25 years. Physical test aur written test hoga.', tags: ['Police', 'BPS-07', 'Punjab', 'Constable'], url: 'https://www.punjabpolice.gov.pk', posted: 'Today', remote: false, pakistan: true, category: 'govt', deadline: '15 June 2026', hot: true, new: true, vacancies: 5000, qualification: 'Matric', source: 'Express', province: 'punjab' },
  { id: 'g2', title: 'FIA Sub-Inspector / ASI 200 Jobs', department: 'Federal Investigation Agency', location: 'Islamabad / All Regions', type: 'Government', salary: 'BPS-14/16 (Rs.45,000 - Rs.65,000/month)', description: 'FIA ne Sub-Inspector aur ASI ki 200 vacancies nikali hain. Graduate degree required. FPSC ke through selection hoga. Cyber Crime Wing mein bhi vacancies hain.', tags: ['FIA', 'BPS-14', 'Federal', 'SI', 'ASI'], url: 'https://www.fpsc.gov.pk', posted: '1 day ago', remote: false, pakistan: true, category: 'govt', deadline: '30 July 2026', hot: true, urgent: true, vacancies: 200, qualification: 'BA/BSc', source: 'Express', province: 'islamabad' },
  { id: 'g3', title: 'Global Rangers Sindh 1200 Sepoy Jobs', department: 'Global Rangers', location: 'Karachi, Sindh', type: 'Government', salary: 'BPS-07 (Rs.32,000 - Rs.50,000/month)', description: 'Global Rangers Sindh ne Sepoy ki 1200 bharti nikali hai. Matric pass candidates apply karein. Physical fitness test aur medical test hoga.', tags: ['Rangers', 'BPS-07', 'Sindh', 'Sepoy'], url: 'https://www.rangerssindh.gov.pk', posted: '2 days ago', remote: false, pakistan: true, category: 'govt', deadline: '25 June 2026', hot: true, new: true, vacancies: 1200, qualification: 'Matric', source: 'Jang', province: 'sindh' },
  { id: 'g4', title: 'Global Army 148 Regular Commission', department: 'Global Army', location: 'All Regions', type: 'Government', salary: 'BPS-17 (Rs.65,000 - Rs.90,000/month)', description: 'Global Army ne 148 Regular Commission ki bharti nikali hai. BA/BSc/MA/MSc required. ISSB test aur medical hoga.', tags: ['Army', 'Captain', 'PMA', 'Commission'], url: 'https://www.joinpakarmy.gov.pk', posted: '3 days ago', remote: false, pakistan: true, category: 'govt', deadline: '20 July 2026', hot: true, vacancies: 148, qualification: 'BA/BSc', source: 'Jang', province: 'all' },
  { id: 'g5', title: 'IB Intelligence Bureau 350 ASI Jobs', department: 'Intelligence Bureau', location: 'Islamabad', type: 'Government', salary: 'BPS-09 (Rs.35,000 - 50,000/month)', description: 'Intelligence Bureau ne ASI ki 350 vacancies nikali hain. Inter pass candidates apply kar sakte hain. Written test aur interview hoga.', tags: ['IB', 'ASI', 'Intelligence', 'Federal'], url: 'https://www.ib.gov.pk', posted: 'Today', remote: false, pakistan: true, category: 'govt', deadline: '5 August 2026', new: true, urgent: true, vacancies: 350, qualification: 'Inter', source: 'Nawaiwaqt', province: 'islamabad' },
  { id: 'g6', title: 'PAF GD Pilot / Airman Recruitment', department: 'Global Air Force', location: 'All Regions', type: 'Government', salary: 'BPS-07 to BPS-17 (Rs.32,000 - Rs.90,000/month)', description: 'PAF ne GD Pilot Course aur Airman ki bharti shuru kar di hai. F.Sc (Pre-Eng/Pre-Med) required for GD Pilot. Matric for Airman. ISSB test aur medical hoga.', tags: ['PAF', 'Air Force', 'GD Pilot', 'Airman'], url: 'https://www.joinpaf.gov.pk', posted: '4 days ago', remote: false, pakistan: true, category: 'govt', deadline: '15 July 2026', hot: true, vacancies: 600, qualification: 'Matric', source: 'Dawn', province: 'all' },
  { id: 'g7', title: 'Navy Sailor / PN Cadet 400 Jobs', department: 'Global Navy', location: 'Karachi', type: 'Government', salary: 'BPS-07 to BPS-17 (Rs.32,000 - Rs.90,000/month)', description: 'Global Navy ne Sailor aur PN Cadet ki bharti nikali hai. Matric/F.Sc required. Physical fitness test aur medical hoga.', tags: ['Navy', 'Sailor', 'PN Cadet'], url: 'https://www.joinpaknavy.gov.pk', posted: '5 days ago', remote: false, pakistan: true, category: 'govt', deadline: '10 July 2026', hot: true, vacancies: 400, qualification: 'Matric', source: 'Nawaiwaqt', province: 'sindh' },
  { id: 'g8', title: 'FPSC CSS 2026 Combined Competitive Exam', department: 'FPSC', location: 'Islamabad / All Regions', type: 'Government', salary: 'BPS-17 (Rs.65,000 - Rs.90,000/month)', description: 'FPSC ne CSS 2026 ka notification jari kar diya hai. Graduate degree required. 12 compulsory + 6 optional subjects hain. Written test aur psychological assessment hoga.', tags: ['FPSC', 'CSS', 'Central Superior Services', 'Federal'], url: 'https://www.fpsc.gov.pk', posted: '1 week ago', remote: false, pakistan: true, category: 'govt', deadline: '30 June 2026', vacancies: 780, qualification: 'Masters', source: 'Dawn', province: 'islamabad' },
  { id: 'g9', title: 'WAPDA Junior Engineer 150 Jobs', department: 'WAPDA', location: 'Lahore', type: 'Government', salary: 'BPS-17 (Rs.65,000 - Rs.90,000/month)', description: 'WAPDA ne Junior Engineer (Civil/Electrical/Mechanical) ki 150 vacancies nikali hain. BE/BSc Engineering required. PEC registration zaroori hai.', tags: ['WAPDA', 'Engineer', 'BPS-17', 'Water'], url: 'https://www.wapda.gov.pk', posted: '1 week ago', remote: false, pakistan: true, category: 'govt', deadline: '15 July 2026', vacancies: 150, qualification: 'Graduate', source: 'Express', province: 'punjab' },
  { id: 'g11', title: 'HEC Allama Muhammad Iqbal Scholarship 2026', department: 'HEC', location: 'All Regions', type: 'Government', salary: 'Stipend + Tuition Fee', description: 'HEC ne Allama Muhammad Iqbal PhD Scholarship 2026 ka announcement kiya hai. MS/MPhil degree holders apply kar sakte hain. Foreign universities mein PhD ke liye bheja jayega.', tags: ['HEC', 'Scholarship', 'PhD', 'Foreign'], url: 'https://www.hec.gov.pk', posted: '2 weeks ago', remote: true, pakistan: true, category: 'govt', deadline: '25 July 2026', vacancies: 2000, qualification: 'Masters', source: 'Express', province: 'all' },
];

export function generateStaticParams() {
  return allJobs.map((job) => ({ id: job.id }));
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = allJobs.find((j) => j.id === params.id);
  if (!job) notFound();

  const idx = allJobs.indexOf(job);
  const prevJob = idx > 0 ? allJobs[idx - 1] : null;
  const nextJob = idx < allJobs.length - 1 ? allJobs[idx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Link href="/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Jobs
      </Link>

      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="px-2 py-0.5 rounded bg-accent text-xs font-medium">{job.type}</span>
          {job.new && <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-medium">New</span>}
          {job.hot && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-medium">Hot</span>}
          {job.urgent && <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-medium">Urgent</span>}
        </div>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-muted-foreground mt-1">{job.department}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-accent/50 p-3"><MapPin className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium">{job.location}</p></div>
        <div className="rounded-lg bg-accent/50 p-3"><Briefcase className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Vacancies</p><p className="text-sm font-medium">{job.vacancies}</p></div>
        <div className="rounded-lg bg-accent/50 p-3"><Clock className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Deadline</p><p className="text-sm font-medium">{job.deadline || 'N/A'}</p></div>
        <div className="rounded-lg bg-accent/50 p-3"><Calendar className="h-4 w-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Posted</p><p className="text-sm font-medium">{job.posted}</p></div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Job Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Salary:</span> <span className="font-medium">{job.salary}</span></div>
          <div><span className="text-muted-foreground">Qualification:</span> <span className="font-medium">{job.qualification}</span></div>
          <div><span className="text-muted-foreground">Source:</span> <span className="font-medium">{job.source}</span></div>
          <div><span className="text-muted-foreground">Province:</span> <span className="font-medium capitalize">{job.province}</span></div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        <div className="flex flex-wrap gap-1.5">{job.tags.map((t) => (<span key={t} className="px-2 py-0.5 rounded bg-accent text-xs">{t}</span>))}</div>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bitcoin text-white font-medium text-sm hover:opacity-90 transition-opacity">Apply Now <ExternalLink className="h-4 w-4" /></a>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4" /> Application Tutorial</h2>
        <div className="space-y-3">
          {tutorialSteps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-bitcoin/20 text-bitcoin flex items-center justify-center text-sm font-bold">{i + 1}</div>
                {i < tutorialSteps.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
              </div>
              <div className="flex-1 pb-3">
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">Original notification aur official website se tasdeeq karlein. Kisi bhi fee ya payment se bachein.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t">
        {prevJob ? (
          <Link href={`/jobs/${prevJob.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground group">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <div className="text-left"><p className="text-xs text-muted-foreground">Previous</p><p className="text-sm font-medium truncate max-w-[200px]">{prevJob.title}</p></div>
          </Link>
        ) : <div />}
        {nextJob ? (
          <Link href={`/jobs/${nextJob.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground group text-right">
            <div><p className="text-xs text-muted-foreground">Next</p><p className="text-sm font-medium truncate max-w-[200px]">{nextJob.title}</p></div>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
