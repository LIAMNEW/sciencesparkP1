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
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['syllabus'],
    queryFn: fetchSyllabusContent,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    initialData: { topics: [], outcomes: [], outcomesMap: {} }
  });

  return {
    topics: data.topics,
    outcomes: data.outcomes,
    outcomesMap: data.outcomesMap,
    syllabusLoading: isLoading,
    syllabusError: isError,
    refetchSyllabus: refetch
  };
}