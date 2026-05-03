/**
 * Consolidate daily news JSON files into monthly archives.
 *
 * Strategy: Rolling window + monthly archives
 * - Files older than 30 days get merged into monthly archives (news-YYYY-MM.json)
 * - Recent daily files (last 30 days) remain as-is
 * - Manifest is updated to reflect the new file set
 *
 * Usage: npx tsx scripts/consolidate-data.ts
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface NewsItem {
  id: string;
  [key: string]: unknown;
}

interface NewsData {
  generatedAt: string;
  weekOf: string;
  coverageStart?: string;
  coverageEnd?: string;
  items: NewsItem[];
}

interface Manifest {
  files: string[];
}

const DATA_DIR = join(import.meta.dirname, '..', 'public', 'data');
const ROLLING_WINDOW_DAYS = 30;

/** Parse date from daily filename like news-MM-DD-YYYY.json */
function parseDailyFilename(filename: string): Date | null {
  const match = filename.match(/^news-(\d{2})-(\d{2})-(\d{4})\.json$/);
  if (!match) return null;
  const [, month, day, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Check if a filename is a monthly archive (news-YYYY-MM.json) */
function isMonthlyArchive(filename: string): boolean {
  return /^news-\d{4}-\d{2}\.json$/.test(filename);
}

/** Get the monthly archive filename for a given date */
function getMonthlyArchiveFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `news-${year}-${month}.json`;
}

/** Merge items from multiple NewsData objects, deduplicating by id */
function mergeItems(files: NewsData[]): NewsItem[] {
  const seen = new Set<string>();
  const merged: NewsItem[] = [];

  // Sort newest-first so newer versions of items win
  const sorted = [...files].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  for (const file of sorted) {
    for (const item of file.items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
  }

  return merged;
}

function run(): void {
  const manifestPath = join(DATA_DIR, 'manifest.json');
  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - ROLLING_WINDOW_DAYS);

  // Separate files into categories
  const dailyFilesToArchive = new Map<string, string[]>(); // monthKey -> filenames
  const filesToKeep: string[] = [];

  for (const filename of manifest.files) {
    if (isMonthlyArchive(filename)) {
      filesToKeep.push(filename);
      continue;
    }

    const fileDate = parseDailyFilename(filename);
    if (!fileDate) {
      // Unknown format, keep as-is
      filesToKeep.push(filename);
      continue;
    }

    if (fileDate < cutoffDate) {
      const monthKey = getMonthlyArchiveFilename(fileDate);
      if (!dailyFilesToArchive.has(monthKey)) {
        dailyFilesToArchive.set(monthKey, []);
      }
      dailyFilesToArchive.get(monthKey)!.push(filename);
    } else {
      filesToKeep.push(filename);
    }
  }

  if (dailyFilesToArchive.size === 0) {
    console.log('No files older than 30 days to consolidate.');
    return;
  }

  // Process each month that needs archiving
  const newArchives: string[] = [];

  for (const [archiveFilename, dailyFiles] of dailyFilesToArchive) {
    console.log(`Archiving ${dailyFiles.length} file(s) → ${archiveFilename}`);

    // Load daily files
    const dailyData: NewsData[] = dailyFiles.map((f) =>
      JSON.parse(readFileSync(join(DATA_DIR, f), 'utf-8'))
    );

    // Load existing archive if it exists
    const archivePath = join(DATA_DIR, archiveFilename);
    const existingArchive: NewsData[] = [];
    if (existsSync(archivePath)) {
      existingArchive.push(JSON.parse(readFileSync(archivePath, 'utf-8')));
      // Remove from filesToKeep to avoid duplicate entry
      const idx = filesToKeep.indexOf(archiveFilename);
      if (idx !== -1) filesToKeep.splice(idx, 1);
    }

    // Merge all items
    const allFiles = [...existingArchive, ...dailyData];
    const mergedItems = mergeItems(allFiles);

    // Compute coverage dates from items
    const dates = mergedItems
      .map((item) => item.publishedAt as string)
      .filter(Boolean)
      .sort();

    const archive: NewsData = {
      generatedAt: new Date().toISOString(),
      weekOf: dates[0] ?? '',
      coverageStart: dates[0] ?? '',
      coverageEnd: dates[dates.length - 1] ?? '',
      items: mergedItems,
    };

    writeFileSync(archivePath, JSON.stringify(archive, null, 2));
    newArchives.push(archiveFilename);

    // Delete archived daily files
    for (const f of dailyFiles) {
      unlinkSync(join(DATA_DIR, f));
      console.log(`  Deleted ${f}`);
    }
  }

  // Build updated manifest: archives first (sorted), then daily files (sorted)
  const allArchives = [...new Set([...filesToKeep.filter(isMonthlyArchive), ...newArchives])].sort();
  const remainingDailies = filesToKeep.filter((f) => !isMonthlyArchive(f)).sort((a, b) => {
    const da = parseDailyFilename(a);
    const db = parseDailyFilename(b);
    if (da && db) return da.getTime() - db.getTime();
    return a.localeCompare(b);
  });

  const updatedManifest: Manifest = {
    files: [...allArchives, ...remainingDailies],
  };

  writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2) + '\n');
  console.log(`\nManifest updated: ${allArchives.length} archive(s) + ${remainingDailies.length} daily file(s)`);
}

run();
