import { useUserPreferences } from '../context/UserPreferencesContext';
import type { KnowledgeCheckResult } from '../types';

interface UseKnowledgeChecksReturn {
  getResult: (id: string) => KnowledgeCheckResult | undefined;
  saveResult: (id: string, answers: number[]) => void;
  isCompleted: (id: string) => boolean;
}

export function useKnowledgeChecks(): UseKnowledgeChecksReturn {
  const { preferences, updateKnowledgeCheckResults } = useUserPreferences();

  const getResult = (id: string) => preferences.knowledgeCheckResults[id];

  const saveResult = (id: string, answers: number[]) => {
    updateKnowledgeCheckResults({
      ...preferences.knowledgeCheckResults,
      [id]: { completedAt: new Date().toISOString(), answers },
    });
  };

  const isCompleted = (id: string) => Boolean(preferences.knowledgeCheckResults[id]);

  return { getResult, saveResult, isCompleted };
}
