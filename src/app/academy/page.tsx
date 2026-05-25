import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/components/ui/ad-placeholder';
import { generateSEO } from '@/lib/seo';
import { cn } from '@/lib/utils/helpers';
import { GraduationCap, BookOpen, TrendingUp, BarChart3, Code, Image, Shield, Clock, ChevronRight, Star, Trophy, Sparkles } from 'lucide-react';

export const metadata: Metadata = generateSEO({
  title: 'BitcoinUrdu Academy',
  description: 'Enroll in BitcoinUrdu Academy courses. Learn Bitcoin fundamentals, crypto trading, DeFi, blockchain development, NFTs, and security best practices.',
});

const courses = [
  { id: 'bitcoin-fundamentals', title: 'Bitcoin Fundamentals', description: 'A complete introduction to Bitcoin — history, technology, mining, and economics.', difficulty: 'Beginner' as const, lessons: 12, duration: '2 hours', progress: 100, icon: BookOpen, color: 'text-bitcoin', featured: true },
  { id: 'crypto-trading-101', title: 'Crypto Trading 101', description: 'Learn technical analysis, chart patterns, order types, and risk management strategies.', difficulty: 'Intermediate' as const, lessons: 18, duration: '3.5 hours', progress: 65, icon: TrendingUp, color: 'text-green-500', featured: false },
  { id: 'defi-deep-dive', title: 'DeFi Deep Dive', description: 'Explore decentralized finance protocols, yield farming, liquidity mining, and governance.', difficulty: 'Advanced' as const, lessons: 22, duration: '5 hours', progress: 30, icon: BarChart3, color: 'text-purple-500', featured: false },
  { id: 'blockchain-dev', title: 'Blockchain Development', description: 'Build smart contracts and dApps on Ethereum, Solana, and Polygon networks.', difficulty: 'Advanced' as const, lessons: 28, duration: '8 hours', progress: 0, icon: Code, color: 'text-blue-500', featured: false },
  { id: 'nft-masterclass', title: 'NFT Masterclass', description: 'Create, buy, sell, and trade NFTs. Learn about marketplaces, minting, and digital art.', difficulty: 'Beginner' as const, lessons: 10, duration: '1.5 hours', progress: 0, icon: Image, color: 'text-pink-500', featured: false },
  { id: 'security-best-practices', title: 'Security Best Practices', description: 'Protect your crypto from hackers and scams with industry-standard security measures.', difficulty: 'Intermediate' as const, lessons: 14, duration: '2.5 hours', progress: 0, icon: Shield, color: 'text-red-500', featured: false },
];

const difficultyColor = {
  Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
} as const;

export default function AcademyPage() {
  const featuredCourse = courses.find((c) => c.featured);
  const regularCourses = courses.filter((c) => !c.featured);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-2">
            <GraduationCap className="h-4 w-4 text-bitcoin" />
            Structured Learning Paths
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            BitcoinUrdu Academy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Structured courses designed to take you from beginner to expert. Learn at your own pace with interactive lessons and quizzes.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#courses">
              <Button variant="bitcoin" size="lg">
                Browse Courses <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/learn-bitcoin">
              <Button variant="outline" size="lg">
                Free Guides
              </Button>
            </Link>
          </div>
        </section>

        <AdPlaceholder size="banner" className="my-8" />

        {featuredCourse && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-bitcoin" />
              <h2 className="text-2xl font-bold">Featured Course</h2>
            </div>
            <Link href={`/learn-bitcoin`}>
              <Card className="relative overflow-hidden border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background group cursor-pointer hover:shadow-lg transition-all duration-200">
                <div className="absolute top-0 right-0">
                  <div className="bg-bitcoin text-white px-4 py-1.5 rounded-bl-xl text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" /> Featured
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-bitcoin/10 flex items-center justify-center shrink-0">
                      <featuredCourse.icon className="h-8 w-8 text-bitcoin" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-2xl group-hover:text-bitcoin transition-colors">{featuredCourse.title}</CardTitle>
                      <p className="text-muted-foreground">{featuredCourse.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Badge variant="outline" className={difficultyColor[featuredCourse.difficulty]}>{featuredCourse.difficulty}</Badge>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-4 w-4" /> {featuredCourse.lessons} lessons
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {featuredCourse.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{featuredCourse.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-bitcoin transition-all" style={{ width: `${featuredCourse.progress}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        <section id="courses" className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-bitcoin" />
            <h2 className="text-2xl font-bold">All Courses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularCourses.map((course) => (
              <Link key={course.id} href="/learn-bitcoin">
                <Card className="card-hover h-full group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-2", course.color.replace('text-', 'bg-').replace('bitcoin', 'bitcoin/10').replace('green-500', 'green-500/10').replace('purple-500', 'purple-500/10').replace('blue-500', 'blue-500/10').replace('pink-500', 'pink-500/10').replace('red-500', 'red-500/10'))}>
                      <course.icon className={cn("h-6 w-6", course.color)} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg group-hover:text-bitcoin transition-colors">{course.title}</CardTitle>
                        <Badge variant="outline" className={cn("shrink-0 text-xs", difficultyColor[course.difficulty])}>{course.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={cn("font-medium", course.progress > 0 ? "text-bitcoin" : "text-muted-foreground")}>{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", course.progress > 0 ? "bg-bitcoin" : "bg-muted-foreground/20")} style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <Card className="border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-background to-background">
            <CardHeader className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm text-muted-foreground mx-auto mb-2">
                <Sparkles className="h-4 w-4 text-bitcoin" />
                Certificate of Completion
              </div>
              <CardTitle className="text-2xl">Earn a Certificate</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground max-w-lg mx-auto">
                Complete any course and earn a verified certificate to showcase your crypto expertise on LinkedIn and your resume.
              </p>
              <Link href="#courses">
                <Button variant="bitcoin" size="lg">
                  Start Learning Today <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <AdPlaceholder size="rectangle" className="my-8" />
      </div>
    </main>
  );
}
