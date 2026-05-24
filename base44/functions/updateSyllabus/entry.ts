import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// NSW Science 7-10 Syllabus (2023) — Implementation from 2026
// Source: https://curriculum.nsw.edu.au/learning-areas/science/science-7-10-2023/outcomes
// 2024/2025: schools plan and prepare; 2026: mandatory implementation begins
const SYLLABUS_VERSION = "NSW Science 7-10 (2023) — Implementation 2026";

const TOPICS = [
  // ── STAGE 4 (Years 7–8) ──────────────────────────────────────────────────
  {
    code: "observing-universe",
    title: "Observing the Universe",
    description: "Explains how observations are used by scientists to increase knowledge and understanding of the Universe. Includes Aboriginal and Torres Strait Islander astronomical knowledge.",
    stage: 4, difficulty: "Beginner",
    outcomes: ["SC4-OTU-01", "SC4-WS-01", "SC4-WS-02", "SC4-WS-05"],
    color: "from-indigo-500 to-purple-600", icon_name: "Telescope", category: "Content Focus Area"
  },
  {
    code: "forces",
    title: "Forces",
    description: "Describes the effects of forces in everyday contexts, including contact and non-contact forces, force diagrams, pressure and simple machines.",
    stage: 4, difficulty: "Intermediate",
    outcomes: ["SC4-FOR-01", "SC4-WS-03", "SC4-WS-04", "SC4-WS-06"],
    color: "from-orange-500 to-red-600", icon_name: "Wind", category: "Content Focus Area"
  },
  {
    code: "cells-classification",
    title: "Cells and Classification",
    description: "Describes the unique features of cells in living things and how structural features can be used to classify organisms, including use of a dichotomous key.",
    stage: 4, difficulty: "Beginner",
    outcomes: ["SC4-CLS-01", "SC4-WS-01", "SC4-WS-05", "SC4-WS-08"],
    color: "from-green-500 to-emerald-600", icon_name: "Microscope", category: "Content Focus Area"
  },
  {
    code: "solutions-mixtures",
    title: "Solutions and Mixtures",
    description: "Explains how the properties of substances enable separation in a range of techniques, including filtration, evaporation, distillation and chromatography.",
    stage: 4, difficulty: "Beginner",
    outcomes: ["SC4-SOL-01", "SC4-WS-02", "SC4-WS-04", "SC4-WS-05"],
    color: "from-blue-500 to-cyan-600", icon_name: "Droplets", category: "Content Focus Area"
  },
  {
    code: "living-systems",
    title: "Living Systems",
    description: "Describes the role, structure and function of a range of living systems and their components, including body systems, plant systems and ecosystems.",
    stage: 4, difficulty: "Intermediate",
    outcomes: ["SC4-LIV-01", "SC4-WS-03", "SC4-WS-06", "SC4-WS-08"],
    color: "from-lime-500 to-green-600", icon_name: "Leaf", category: "Content Focus Area"
  },
  {
    code: "periodic-table",
    title: "Periodic Table and Atomic Structure",
    description: "Explains how uses of elements and compounds are influenced by scientific understanding and discoveries relating to their properties. Includes atomic models and the periodic table.",
    stage: 4, difficulty: "Intermediate",
    outcomes: ["SC4-PRT-01", "SC4-WS-01", "SC4-WS-07", "SC4-WS-08"],
    color: "from-purple-500 to-pink-600", icon_name: "Atom", category: "Content Focus Area"
  },
  {
    code: "change",
    title: "Change",
    description: "Explains how energy causes geological and chemical change, including physical and chemical changes, rock cycle, and heat transfer.",
    stage: 4, difficulty: "Intermediate",
    outcomes: ["SC4-CHG-01", "SC4-WS-04", "SC4-WS-05", "SC4-WS-06"],
    color: "from-amber-500 to-orange-600", icon_name: "Mountain", category: "Content Focus Area"
  },
  {
    code: "data-science-1",
    title: "Data Science 1",
    description: "Explains how data is used by scientists to model and predict scientific phenomena. Includes data collection, representation, scientific models and predictions. Can be integrated across other focus areas.",
    stage: 4, difficulty: "Beginner",
    outcomes: ["SC4-DA1-01", "SC4-WS-04", "SC4-WS-05", "SC4-WS-07"],
    color: "from-teal-500 to-cyan-600", icon_name: "BarChart3", category: "Content Focus Area"
  },

  // ── STAGE 5 (Years 9–10) ─────────────────────────────────────────────────
  {
    code: "energy",
    title: "Energy",
    description: "Evaluates current and alternative energy use based on ethical and sustainability considerations, including conservation of energy, electrical circuits and energy sources.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-EGY-01", "SC5-WS-04", "SC5-WS-06", "SC5-WS-07"],
    color: "from-yellow-500 to-orange-600", icon_name: "Zap", category: "Content Focus Area"
  },
  {
    code: "disease",
    title: "Disease",
    description: "Explains how an understanding of the causes of disease can be used to prevent and manage the spread of disease, including homeostasis, infectious and non-infectious diseases.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-DIS-01", "SC5-WS-04", "SC5-WS-06", "SC5-WS-08"],
    color: "from-red-500 to-pink-600", icon_name: "Pill", category: "Content Focus Area"
  },
  {
    code: "materials",
    title: "Materials",
    description: "Assesses the uses of materials based on their physical and chemical properties, including chemical bonding, organic chemistry, polymers and sustainable materials.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-MAT-01", "SC5-WS-02", "SC5-WS-03", "SC5-WS-07"],
    color: "from-slate-500 to-gray-600", icon_name: "FlaskConical", category: "Content Focus Area"
  },
  {
    code: "environmental-sustainability",
    title: "Environmental Sustainability",
    description: "Analyses the impact of human activity on the natural world, including sustainability principles, climate science, biodiversity and recycling.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-ENV-01", "SC5-WS-05", "SC5-WS-06", "SC5-WS-08"],
    color: "from-green-500 to-teal-600", icon_name: "Recycle", category: "Content Focus Area"
  },
  {
    code: "genetics-evolutionary-change",
    title: "Genetics and Evolutionary Change",
    description: "Covers DNA, inheritance, genetic technologies and evolution by natural selection. Connects diversity of living things to evolutionary theory and heredity.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-GEV-01", "SC5-GEV-02", "SC5-WS-04", "SC5-WS-08"],
    color: "from-violet-500 to-purple-600", icon_name: "Dna", category: "Content Focus Area"
  },
  {
    code: "reactions",
    title: "Reactions",
    description: "Describes a range of reaction types and explains factors affecting reaction rates, including conservation of mass, chemical equations and nuclear reactions.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-RXN-01", "SC5-RXN-02", "SC5-WS-03", "SC5-WS-06"],
    color: "from-orange-500 to-red-600", icon_name: "Flame", category: "Content Focus Area"
  },
  {
    code: "waves-motion",
    title: "Waves and Motion",
    description: "Describes the features and applications of different forms of waves, and explains the motion of objects using Newton's laws of motion.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-WAM-01", "SC5-WAM-02", "SC5-WS-04", "SC5-WS-07"],
    color: "from-blue-500 to-indigo-600", icon_name: "Waves", category: "Content Focus Area"
  },
  {
    code: "data-science-2",
    title: "Data Science 2",
    description: "Assesses the use of scientific knowledge and data in evidence-based decisions and when verifying the legitimacy of claims, including distinguishing science from pseudoscience.",
    stage: 5, difficulty: "Advanced",
    outcomes: ["SC5-DA2-01", "SC5-WS-07", "SC5-WS-08"],
    color: "from-cyan-500 to-blue-600", icon_name: "BarChart3", category: "Content Focus Area"
  }
];

// Outcome descriptions sourced directly from:
// https://curriculum.nsw.edu.au/learning-areas/science/science-7-10-2023/outcomes
const OUTCOMES = [
  // ── Stage 4 — Working Scientifically ──────────────────────────────────────
  {
    code: "SC4-WS-01", title: "Observing",
    description: "Uses scientific tools and instruments for observations.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-02", title: "Questioning and predicting",
    description: "Identifies questions and makes predictions to guide scientific investigations.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-03", title: "Planning investigations",
    description: "Plans safe and valid investigations.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-04", title: "Conducting investigations",
    description: "Follows a planned procedure to undertake safe and valid investigations.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-05", title: "Processing data and information",
    description: "Uses a variety of ways to process and represent data.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-06", title: "Analysing data and information",
    description: "Uses data to identify trends, patterns and relationships, and draw conclusions.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-07", title: "Problem-solving",
    description: "Identifies problem-solving strategies and proposes solutions.",
    stage: 4, category: "Working Scientifically"
  },
  {
    code: "SC4-WS-08", title: "Communicating",
    description: "Communicates scientific concepts and ideas using a range of communication forms.",
    stage: 4, category: "Working Scientifically"
  },

  // ── Stage 4 — Content Focus Areas ─────────────────────────────────────────
  {
    code: "SC4-OTU-01", title: "Observing the Universe",
    description: "Explains how observations are used by scientists to increase knowledge and understanding of the Universe.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-FOR-01", title: "Forces",
    description: "Describes the effects of forces in everyday contexts.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-CLS-01", title: "Cells and Classification",
    description: "Describes the unique features of cells in living things and how structural features can be used to classify organisms.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-SOL-01", title: "Solutions and Mixtures",
    description: "Explains how the properties of substances enable separation in a range of techniques.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-LIV-01", title: "Living Systems",
    description: "Describes the role, structure and function of a range of living systems and their components.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-PRT-01", title: "Periodic Table and Atomic Structure",
    description: "Explains how uses of elements and compounds are influenced by scientific understanding and discoveries relating to their properties.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-CHG-01", title: "Change",
    description: "Explains how energy causes geological and chemical change.",
    stage: 4, category: "Content Focus Area"
  },
  {
    code: "SC4-DA1-01", title: "Data Science 1",
    description: "Explains how data is used by scientists to model and predict scientific phenomena.",
    stage: 4, category: "Content Focus Area"
  },

  // ── Stage 5 — Working Scientifically ──────────────────────────────────────
  {
    code: "SC5-WS-01", title: "Observing",
    description: "Selects and uses scientific tools and instruments for accurate observations.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-02", title: "Questioning and predicting",
    description: "Develops questions and hypotheses for scientific investigation.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-03", title: "Planning investigations",
    description: "Designs safe, ethical, valid and reliable investigations.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-04", title: "Conducting investigations",
    description: "Follows a planned procedure to undertake safe, ethical, valid and reliable investigations.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-05", title: "Processing data and information",
    description: "Selects and uses a range of tools to process and represent data.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-06", title: "Analysing data and information",
    description: "Analyses data from investigations to identify trends, patterns and relationships, and draws conclusions.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-07", title: "Problem-solving",
    description: "Selects suitable problem-solving strategies and evaluates proposed solutions to identified problems.",
    stage: 5, category: "Working Scientifically"
  },
  {
    code: "SC5-WS-08", title: "Communicating",
    description: "Communicates scientific arguments with evidence, using scientific language and terminology in a range of communication forms.",
    stage: 5, category: "Working Scientifically"
  },

  // ── Stage 5 — Content Focus Areas ─────────────────────────────────────────
  {
    code: "SC5-EGY-01", title: "Energy",
    description: "Evaluates current and alternative energy use based on ethical and sustainability considerations.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-DIS-01", title: "Disease",
    description: "Explains how an understanding of the causes of disease can be used to prevent and manage the spread of disease.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-MAT-01", title: "Materials",
    description: "Assesses the uses of materials based on their physical and chemical properties.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-ENV-01", title: "Environmental Sustainability",
    description: "Analyses the impact of human activity on the natural world.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-GEV-01", title: "Genetics and Evolutionary Change 1",
    description: "Describes the relationship between the diversity of living things and the theory of evolution.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-GEV-02", title: "Genetics and Evolutionary Change 2",
    description: "Explains how DNA is responsible for the transmission of heritable characteristics and can be manipulated through genetic technologies.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-RXN-01", title: "Reactions 1",
    description: "Describes a range of reaction types.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-RXN-02", title: "Reactions 2",
    description: "Explains the factors that affect the rate of chemical reactions.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-WAM-01", title: "Waves and Motion 1",
    description: "Describes the features and applications of different forms of waves.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-WAM-02", title: "Waves and Motion 2",
    description: "Explains the motion of objects using Newton's laws of motion.",
    stage: 5, category: "Content Focus Area"
  },
  {
    code: "SC5-DA2-01", title: "Data Science 2",
    description: "Assesses the use of scientific knowledge and data in evidence-based decisions and when verifying the legitimacy of claims.",
    stage: 5, category: "Content Focus Area"
  }
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
      message: `Syllabus updated to: ${SYLLABUS_VERSION}`,
      topics_added: TOPICS.length,
      outcomes_added: OUTCOMES.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});