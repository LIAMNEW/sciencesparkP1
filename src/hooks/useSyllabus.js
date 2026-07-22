import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

// Icon map — keeps Topics.jsx clean (no dynamic imports needed)
import {
  Microscope, Zap, Atom, Mountain, Telescope, Wind, Droplets,
  FlaskConical, BarChart3, Dna, Leaf, Recycle, Flame, Waves, Pill
} from "lucide-react";

const ICON_MAP = {
  Microscope, Zap, Atom, Mountain, Telescope, Wind, Droplets,
  FlaskConical, BarChart3, Dna, Leaf, Recycle, Flame, Waves, Pill
};

const fetchSyllabusContent = async () => {
  const records = await base44.entities.SyllabusContent.filter({ is_active: true });
  const topics = records
    .filter(r => r.type === "topic")
    .map(r => ({ ...r, icon: ICON_MAP[r.icon_name] || FlaskConical }));
  const outcomes = records.filter(r => r.type === "outcome");
  // Build outcomes map { code: name } for Progress page
  const outcomesMap = Object.fromEntries(outcomes.map(o => [o.code, o.title]));
  return { topics, outcomes, outcomesMap };
};

export function useSyllabus() {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['syllabus'],
    queryFn: fetchSyllabusContent,
    // No initialData + no staleTime so every mount fetches fresh and the
    // real loading/error state is surfaced (avoids stuck empty cache).
  });

  const safe = data || { topics: [], outcomes: [], outcomesMap: {} };

  return {
    topics: safe.topics,
    outcomes: safe.outcomes,
    outcomesMap: safe.outcomesMap,
    syllabusLoading: isLoading || isFetching,
    syllabusError: isError,
    syllabusErrorMessage: error?.message,
    refetchSyllabus: refetch
  };
}