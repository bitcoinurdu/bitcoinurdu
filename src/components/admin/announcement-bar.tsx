'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Edit3, ExternalLink, Save } from 'lucide-react';

interface Announcement {
  id: string;
  text: string;
  url: string;
  active: boolean;
  bgClass?: string;
  textClass?: string;
}

const LS_KEY = 'bu_announcements';
const CLICK_THRESHOLD = 7;
const CLICK_WINDOW_MS = 5000;

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'asl-miners',
    text: '\uD83D\uDE80 ASL Miners Special! Use code \u201CBITCOINURDU\u201D for $30 OFF on all orders. Limited time!',
    url: 'https://aslminer.com/?ref=Bitcoinurdu',
    active: true,
    bgClass: 'from-orange-500/10 via-yellow-500/10 to-orange-500/10 border-orange-500/20',
    textClass: 'text-orange-300',
  },
];

function loadAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_ANNOUNCEMENTS;
}

function saveAnnouncements(items: Announcement[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

export function AnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const clickTimestamps = useRef<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadAnnouncements());
    setLoaded(true);
  }, []);

  const activeItems = items.filter((a) => a.active);

  if (!loaded || activeItems.length === 0) return null;

  const handleClick = (idx: number) => {
    const now = Date.now();
    clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < CLICK_WINDOW_MS);
    clickTimestamps.current.push(now);
    if (clickTimestamps.current.length >= CLICK_THRESHOLD) {
      clickTimestamps.current = [];
      setAdminMode(!adminMode);
      setEditIdx(null);
    }
    if (!adminMode && activeItems[idx]?.url) {
      window.open(activeItems[idx].url, '_blank', 'noopener,noreferrer');
    }
  };

  const updateItem = (idx: number, field: keyof Announcement, value: string | boolean) => {
    const next = [...items];
    const realIdx = items.findIndex((a) => a.id === activeItems[idx].id);
    if (realIdx === -1) return;
    next[realIdx] = { ...next[realIdx], [field]: value };
    setItems(next);
  };

  const save = () => {
    saveAnnouncements(items);
    setEditIdx(null);
    setAdminMode(false);
  };

  const addNew = () => {
    const newItem: Announcement = {
      id: `custom-${Date.now()}`,
      text: 'New announcement',
      url: 'https://',
      active: true,
    };
    setItems([...items, newItem]);
    setEditIdx(items.length);
  };

  const removeItem = (idx: number) => {
    const realIdx = items.findIndex((a) => a.id === activeItems[idx].id);
    if (realIdx === -1) return;
    const next = items.filter((_, i) => i !== realIdx);
    setItems(next);
  };

  return (
    <div>
      {activeItems.map((item, idx) => (
        <div
          key={item.id}
          onClick={() => handleClick(idx)}
          className={`bg-gradient-to-r ${item.bgClass || 'from-blue-500/10 via-purple-500/10 to-blue-500/10'} border ${item.textClass ? `border-orange-500/20` : 'border-blue-500/20'} rounded-xl p-3 mb-6 flex items-center gap-2 text-sm flex-wrap cursor-pointer hover:opacity-90 transition-opacity group relative`}
        >
          <span className="text-lg">{'\uD83D\uDCE2'}</span>
          {adminMode && editIdx === null ? (
            <span className={item.textClass || 'text-blue-300'}>
              {item.text}
            </span>
          ) : adminMode && editIdx === idx ? (
            <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text" value={item.text}
                onChange={(e) => updateItem(idx, 'text', e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#1a1a2e] border border-gray-600 text-sm text-white"
                placeholder="Announcement text"
              />
              <input
                type="url" value={item.url}
                onChange={(e) => updateItem(idx, 'url', e.target.value)}
                className="w-full px-2 py-1 rounded bg-[#1a1a2e] border border-gray-600 text-sm text-white"
                placeholder="URL (optional)"
              />
              <div className="flex gap-2">
                <label className="flex items-center gap-1 text-xs text-gray-400">
                  <input type="checkbox" checked={item.active}
                    onChange={(e) => updateItem(idx, 'active', e.target.checked)}
                  /> Active
                </label>
                <button onClick={() => removeItem(idx)}
                  className="text-xs text-red-400 hover:text-red-300 ml-auto"
                >Delete</button>
              </div>
            </div>
          ) : (
            <span className={item.textClass || 'text-blue-300'}>
              {item.text}
            </span>
          )}
          {adminMode && editIdx === null && (
            <div className="flex gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setEditIdx(idx)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                title="Edit announcement"
              ><Edit3 className="h-3 w-3" /></button>
              <button onClick={save}
                className="p-1 rounded bg-green-600/30 hover:bg-green-600/50 text-xs"
                title="Save all to localStorage"
              ><Save className="h-3 w-3" /></button>
              <button onClick={addNew}
                className="p-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-xs text-blue-300"
              >+ Add</button>
              <button onClick={() => { setAdminMode(false); save(); }}
                className="p-1 rounded bg-red-600/30 hover:bg-red-600/50 text-xs"
              ><X className="h-3 w-3" /></button>
            </div>
          )}
          {!adminMode && (
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity text-gray-400 ml-auto shrink-0" />
          )}
        </div>
      ))}
      {adminMode && editIdx !== null && (
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setEditIdx(null); }}
            className="px-3 py-1.5 rounded-lg bg-gray-700 text-xs text-white"
          >Cancel</button>
          <button onClick={save}
            className="px-3 py-1.5 rounded-lg bg-green-600 text-xs text-white font-medium"
          ><Save className="h-3 w-3 inline mr-1" /> Save</button>
        </div>
      )}
    </div>
  );
}
