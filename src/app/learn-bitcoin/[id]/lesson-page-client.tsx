'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Languages } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Lesson {
  title: string;
  titleUrdu: string;
  duration: string;
  level: string;
  content: string;
  contentUrdu?: string;
}

function renderMarkdown(content: string) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-bitcoin prose-code:bg-muted-foreground/10 prose-code:px-1 prose-code:rounded prose-code:text-foreground prose-table:text-sm prose-th:border prose-td:border prose-th:border-border prose-td:border-border prose-th:p-2 prose-td:p-2">
      {content}
    </ReactMarkdown>
  );
}

export function LessonPageClient({ lesson }: { lesson: Lesson }) {
  const [showUrdu, setShowUrdu] = useState(false);

  const content = showUrdu && lesson.contentUrdu ? lesson.contentUrdu : lesson.content;
  const title = showUrdu && lesson.titleUrdu ? lesson.titleUrdu : lesson.title;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/learn-bitcoin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Wapis Lessons Par
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="badge badge-bitcoin">{lesson.level}</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3 w-3" />{lesson.duration}</span>
          {lesson.contentUrdu && (
            <button
              onClick={() => setShowUrdu(!showUrdu)}
              className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg border hover:bg-accent transition-colors"
            >
              <Languages className="h-3.5 w-3.5" />
              {showUrdu ? 'Show Roman Urdu' : 'اردو میں ترجمہ دیکھیں'}
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-bitcoin" />
          {title}
        </h1>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}
