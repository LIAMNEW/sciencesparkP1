import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// NSW Science 7-10 (2023) Syllabus Data
// Update this data when NESA releases a new syllabus version
const SYLLABUS_VERSION = "NSW Science 7-10 2023";

const TOPICS = [
  // STAGE 4 (Years 7-8)
  { code: "observing-universe", title: "Observing the Universe", description: "Explore how scientific observations increase knowledge of the Universe", stage: 4, difficulty: "Beginner", outcomes: ["SC4-OTU-01", "SC4-WS-01", "SC4-WS-02"], color: "from-indigo-500 to-purple-600", icon_name: "Telescope", category: "Content Focus Area" },
  { code: "forces", title: "Forces", description: "Describe contact and non-contact forces, force diagrams and simple machines", stage: 4, difficulty: "Intermediate", outcomes: ["SC4-FOR-01", "SC4-WS-03", "SC4-WS-05"], color: "from-orange-500 to-red-600", icon_name: "Wind", category: "Content Focus Area" },
  { code: "cells-classification", title: "Cells and Classification", description: "Cell structures and classification of organisms using scientific conventions", stage: 4, difficulty: "Beginner", outcomes: ["SC4-CLS-01", "SC4-WS-01", "SC4-WS-06"], color: "from-green-500 to-emerald-600", icon_name: "Microscope", category: "Content Focus Area" },
  { code: "solutions-mixtures", title: "Solutions and Mixtures", description: "Properties of substances and separation techniques", stage: 4, difficulty: "Beginner", outcomes: ["SC4-SOL-01", "SC4-WS-02", "SC4-WS-04"], color: "from-blue-500 to-cyan-600", icon_name: "Droplets", category: "Content Focus Area" },
  { code: "living-systems", title: "Living Systems", description: "Body systems, plant systems and ecosystems", stage: 4, difficulty: "Intermediate", outcomes: ["SC4-LIV-01", "SC4-WS-03", "SC4-WS-04"], color: "from-lime-500 to-green-600", icon_name: "Leaf", category: "Content Focus Area" },
  { code: "periodic-table", title: "Periodic Table & Atomic Structure", description: "Elements, compounds and atomic models", stage: 4, difficulty: "Intermediate", outcomes: ["SC4-PRT-01", "SC4-WS-01", "SC4-WS-07"], color: "from-purple-500 to-pink-600", icon_name: "Atom", category: "Content Focus Area" },
  { code: "change", title: "Change", description: "Energy causes geological and chemical change", stage: 4, difficulty: "Intermediate", outcomes: ["SC4-CHG-01", "SC4-WS-04", "SC4-WS-05"], color: "from-amber-500 to-orange-600", icon_name: "Mountain", category: "Content Focus Area" },
  { code: "data-science-1", title: "Data Science 1", description: "Using data to model and predict phenomena", stage: 4, difficulty: "Beginner", outcomes: ["SC4-DA1-01", "SC4-WS-04", "SC4-WS-07"], color: "from-teal-500 to-cyan-600", icon_name: "BarChart3", category: "Content Focus Area" },

  // STAGE 5 (Years 9-10)
  { code: "energy", title: "Energy", description: "Energy sources, conservation of energy and electrical circuits", stage: 5, difficulty: "Advanced", outcomes: ["SC5-EGY-01", "SC5-WS-04", "SC5-WS-06"], color: "from-yellow-500 to-orange-600", icon_name: "Zap", category: "Content Focus Area" },
  { code: "disease", title: "Disease", description: "Causes of disease, prevention and management", stage: 5, difficulty: "Advanced", outcomes: ["SC5-DIS-01", "SC5-WS-04", "SC5-WS-06"], color: "from-red-500 to-pink-600", icon_name: "Pill", category: "Content Focus Area" },
  { code: "materials", title: "Materials", description: "Chemical properties, bonding and polymers", stage: 5, difficulty: "Advanced", outcomes: ["SC5-MAT-01", "SC5-WS-02", "SC5-WS-03"], color: "from-slate-500 to-gray-600", icon_name: "FlaskConical", category: "Content Focus Area" },
  { code: "environmental-sustainability", title: "Environmental Sustainability", description: "Climate science, human impacts and recycling", stage: 5, difficulty: "Advanced", outcomes: ["SC5-ENV-01", "SC5-WS-05", "SC5-WS-06"], color: "from-green-500 to-teal-600", icon_name: "Recycle", category: "Content Focus Area" },
  { code: "genetics", title: "Genetics & Evolutionary Change", description: "DNA, inheritance and natural selection", stage: 5, difficulty: "Advanced", outcomes: ["SC5-GEV-01", "SC5-GEV-02", "SC5-WS-04"], color: "from-violet-500 to-purple-600", icon_name: "Dna", category: "Content Focus Area" },
  { code: "reactions", title: "Reactions", description: "Chemical and nuclear reactions", stage: 5, difficulty: "Advanced", outcomes: ["SC5-RXN-01", "SC5-RXN-02", "SC5-WS-03"], color: "from-orange-500 to-red-600", icon_name: "Flame", category: "Content Focus Area" },
  { code: "waves-motion", title: "Waves and Motion", description: "Properties of waves and Newton's laws of motion", stage: 5, difficulty: "Advanced", outcomes: ["SC5-WAM-01", "SC5-WAM-02", "SC5-WS-04"], color: "from-blue-500 to-indigo-600", icon_name: "Waves", category: "Content Focus Area" },
  { code: "data-science-2", title: "Data Science 2", description: "Evidence-based decisions and scientific claims", stage: 5, difficulty: "Advanced", outcomes: ["SC5-DA2-01", "SC5-WS-07", "SC5-WS-08"], color: "from-cyan-500 to-blue-600", icon_name: "BarChart3", category: "Content Focus Area" }
];

const OUTCOMES = [
  // Stage 4 Working Scientifically
  { code: "SC4-WS-01", title: "Questioning and predicting", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-02", title: "Planning investigations", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-03", title: "Conducting investigations", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-04", title: "Processing data and information", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-05", title: "Analysing data and information", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-06", title: "Problem-solving", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-07", title: "Communicating", stage: 4, category: "Working Scientifically" },
  { code: "SC4-WS-08", title: "Working collaboratively", stage: 4, category: "Working Scientifically" },

  // Stage 4 Content
  { code: "SC4-OTU-01", title: "Observing the Universe", stage: 4, category: "Content Focus Area" },
  { code: "SC4-FOR-01", title: "Forces", stage: 4, category: "Content Focus Area" },
  { code: "SC4-CLS-01", title: "Cells and Classification", stage: 4, category: "Content Focus Area" },
  { code: "SC4-SOL-01", title: "Solutions and Mixtures", stage: 4, category: "Content Focus Area" },
  { code: "SC4-LIV-01", title: "Living Systems", stage: 4, category: "Content Focus Area" },
  { code: "SC4-PRT-01", title: "Periodic Table and Atomic Structure", stage: 4, category: "Content Focus Area" },
  { code: "SC4-CHG-01", title: "Change", stage: 4, category: "Content Focus Area" },
  { code: "SC4-DA1-01", title: "Data Science 1", stage: 4, category: "Content Focus Area" },

  // Stage 5 Working Scientifically
  { code: "SC5-WS-01", title: "Questioning and predicting", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-02", title: "Planning investigations", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-03", title: "Conducting investigations", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-04", title: "Processing data and information", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-05", title: "Analysing data and information", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-06", title: "Problem-solving", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-07", title: "Communicating", stage: 5, category: "Working Scientifically" },
  { code: "SC5-WS-08", title: "Working collaboratively", stage: 5, category: "Working Scientifically" },

  // Stage 5 Content
  { code: "SC5-EGY-01", title: "Energy", stage: 5, category: "Content Focus Area" },
  { code: "SC5-DIS-01", title: "Disease", stage: 5, category: "Content Focus Area" },
  { code: "SC5-MAT-01", title: "Materials", stage: 5, category: "Content Focus Area" },
  { code: "SC5-ENV-01", title: "Environmental Sustainability", stage: 5, category: "Content Focus Area" },
  { code: "SC5-GEV-01", title: "Genetics and Evolutionary Change 1", stage: 5, category: "Content Focus Area" },
  { code: "SC5-GEV-02", title: "Genetics and Evolutionary Change 2", stage: 5, category: "Content Focus Area" },
  { code: "SC5-RXN-01", title: "Reactions 1", stage: 5, category: "Content Focus Area" },
  { code: "SC5-RXN-02", title: "Reactions 2", stage: 5, category: "Content Focus Area" },
  { code: "SC5-WAM-01", title: "Waves and Motion 1", stage: 5, category: "Content Focus Area" },
  { code: "SC5-WAM-02", title: "Waves and Motion 2", stage: 5, category: "Content Focus Area" },
  { code: "SC5-DA2-01", title: "Data Science 2", stage: 5, category: "Content Focus Area" }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Delete all existing syllabus records and replace with current data
    const existing = await base44.asServiceRole.entities.SyllabusContent.list();
    for (const record of existing) {
      await base44.asServiceRole.entities.SyllabusContent.delete(record.id);
    }

    // Seed topics
    for (const topic of TOPICS) {
      await base44.asServiceRole.entities.SyllabusContent.create({
        type: "topic",
        syllabus_version: SYLLABUS_VERSION,
        is_active: true,
        ...topic
      });
    }

    // Seed outcomes
    for (const outcome of OUTCOMES) {
      await base44.asServiceRole.entities.SyllabusContent.create({
        type: "outcome",
        syllabus_version: SYLLABUS_VERSION,
        is_active: true,
        ...outcome
      });
    }

    return Response.json({
      success: true,
      message: `Syllabus updated to ${SYLLABUS_VERSION}`,
      topics_added: TOPICS.length,
      outcomes_added: OUTCOMES.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});