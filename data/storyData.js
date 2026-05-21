const baseMetricOrder = [
  'very_satisfied',
  'satisfied',
  'neutral',
  'dissatisfied',
  'very_dissatisfied',
  'no_answer',
]

export const accessibilityHappinessStory = {
  sectionId: 'accessibility-happiness',
  titleKey: 'accessibility_happiness_question',
  metricOrder: baseMetricOrder,
  metricsByTransportation: {
    bike: {
      default: {
        very_satisfied: 8,
        satisfied: 39,
        neutral: 23,
        dissatisfied: 8,
        very_dissatisfied: 2,
        no_answer: 20,
      },
    },
    car: {
      default: {
        very_satisfied: 8,
        satisfied: 39,
        neutral: 23,
        dissatisfied: 8,
        very_dissatisfied: 2,
        no_answer: 20,
      },
    },
    bus: {
      default: {
        very_satisfied: 8,
        satisfied: 39,
        neutral: 23,
        dissatisfied: 8,
        very_dissatisfied: 2,
        no_answer: 20,
      },
    },
    walk: {
      default: {
        very_satisfied: 8,
        satisfied: 39,
        neutral: 23,
        dissatisfied: 8,
        very_dissatisfied: 2,
        no_answer: 20,
      },
    },
  },
  bubble: [
    {
      id: 'positive',
      segments: [
        { type: 'metric', key: 'very_satisfied' },
        { type: 'text', key: 'accessibility_happiness_bullet_1_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_1_highlight_1',
          tone: 'blue',
        },
        { type: 'text', key: 'accessibility_happiness_bullet_1_text_2' },
        { type: 'metric', key: 'satisfied' },
        { type: 'text', key: 'accessibility_happiness_bullet_1_text_3' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_1_highlight_2',
          tone: 'mint',
        },
      ],
    },
    {
      id: 'neutral',
      segments: [
        { type: 'metric', key: 'neutral' },
        { type: 'text', key: 'accessibility_happiness_bullet_2_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_2_highlight_1',
          tone: 'yellow',
        },
      ],
    },
    {
      id: 'negative',
      segments: [
        { type: 'text', key: 'accessibility_happiness_bullet_3_text_1' },
        { type: 'metric', key: 'dissatisfied_total' },
        { type: 'text', key: 'accessibility_happiness_bullet_3_text_2' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_3_highlight_1',
          tone: 'orange-soft',
        },
        { type: 'text', key: 'accessibility_happiness_bullet_3_text_3' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_3_highlight_2',
          tone: 'orange-light',
        },
        { type: 'text', key: 'accessibility_happiness_bullet_3_text_4' },
      ],
    },
    {
      id: 'no-answer',
      segments: [
        { type: 'metric', key: 'no_answer' },
        { type: 'text', key: 'accessibility_happiness_bullet_4_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_happiness_bullet_4_highlight_1',
          tone: 'taupe-light',
        },
        { type: 'text', key: 'accessibility_happiness_bullet_4_text_2' },
      ],
    },
  ],
}

export const accessibilityRoadStory = {
  sectionId: 'accessibility-road',
  titleKey: 'accessibility_road_question',
  metricOrder: baseMetricOrder,
  metricsByTransportation: {
    bike: {
      default: {
        very_satisfied: 5,
        satisfied: 31,
        neutral: 19,
        dissatisfied: 6,
        very_dissatisfied: 3,
        no_answer: 36,
      },
    },
    car: {
      default: {
        very_satisfied: 5,
        satisfied: 31,
        neutral: 19,
        dissatisfied: 6,
        very_dissatisfied: 3,
        no_answer: 36,
      },
    },
    bus: {
      default: {
        very_satisfied: 5,
        satisfied: 31,
        neutral: 19,
        dissatisfied: 6,
        very_dissatisfied: 3,
        no_answer: 36,
      },
    },
    walk: {
      default: {
        very_satisfied: 5,
        satisfied: 31,
        neutral: 19,
        dissatisfied: 6,
        very_dissatisfied: 3,
        no_answer: 36,
      },
    },
  },
  bubble: [
    {
      id: 'positive',
      segments: [
        { type: 'metric', key: 'very_satisfied' },
        { type: 'text', key: 'accessibility_road_bullet_1_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_1_highlight_1',
          tone: 'blue',
        },
        { type: 'text', key: 'accessibility_road_bullet_1_text_2' },
        { type: 'metric', key: 'satisfied' },
        { type: 'text', key: 'accessibility_road_bullet_1_text_3' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_1_highlight_2',
          tone: 'mint',
        },
      ],
    },
    {
      id: 'neutral',
      segments: [
        { type: 'metric', key: 'neutral' },
        { type: 'text', key: 'accessibility_road_bullet_2_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_2_highlight_1',
          tone: 'yellow',
        },
      ],
    },
    {
      id: 'negative',
      segments: [
        { type: 'text', key: 'accessibility_road_bullet_3_text_1' },
        { type: 'metric', key: 'dissatisfied_total' },
        { type: 'text', key: 'accessibility_road_bullet_3_text_2' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_3_highlight_1',
          tone: 'orange-soft',
        },
        { type: 'text', key: 'accessibility_road_bullet_3_text_3' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_3_highlight_2',
          tone: 'orange-light',
        },
        { type: 'text', key: 'accessibility_road_bullet_3_text_4' },
      ],
    },
    {
      id: 'no-answer',
      segments: [
        { type: 'metric', key: 'no_answer' },
        { type: 'text', key: 'accessibility_road_bullet_4_text_1' },
        {
          type: 'highlight',
          key: 'accessibility_road_bullet_4_highlight_1',
          tone: 'taupe-light',
        },
        { type: 'text', key: 'accessibility_road_bullet_4_text_2' },
      ],
    },
  ],
}

export const safetyStory = {
  sectionId: 'safety',
  titleKey: 'safety_intro_question',
  metricOrder: [],
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  bubble: [],
}

export const safetyDetailsStory = {
  titleKey: 'safety_detail_question',
  metricOrder: [
    'very_safe',
    'rather_safe',
    'neutral',
    'rather_unsafe',
    'very_unsafe',
    'no_answer',
  ],
  metricsByTransportation: {
    bike: {
      default: {
        very_safe: 2,
        rather_safe: 12,
        neutral: 31,
        rather_unsafe: 24,
        very_unsafe: 12,
        no_answer: 36,
      },
    },
    car: {
      default: {
        very_safe: 2,
        rather_safe: 12,
        neutral: 31,
        rather_unsafe: 24,
        very_unsafe: 12,
        no_answer: 36,
      },
    },
    bus: {
      default: {
        very_safe: 2,
        rather_safe: 12,
        neutral: 31,
        rather_unsafe: 24,
        very_unsafe: 12,
        no_answer: 36,
      },
    },
    walk: {
      default: {
        very_safe: 2,
        rather_safe: 12,
        neutral: 31,
        rather_unsafe: 24,
        very_unsafe: 12,
        no_answer: 36,
      },
    },
  },
  bubble: [
    {
      id: 'positive',
      segments: [
        { type: 'text', key: 'safety_detail_bullet_1_text_1' },
        { type: 'metric', key: 'very_safe' },
        { type: 'text', key: 'safety_detail_bullet_1_text_2' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_1_highlight_1',
          tone: 'blue',
        },
        { type: 'text', key: 'safety_detail_bullet_1_text_3' },
        { type: 'metric', key: 'rather_safe' },
        { type: 'text', key: 'safety_detail_bullet_1_text_4' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_1_highlight_2',
          tone: 'mint',
        },
      ],
    },
    {
      id: 'neutral',
      segments: [
        { type: 'metric', key: 'neutral' },
        { type: 'text', key: 'safety_detail_bullet_2_text_1' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_2_highlight_1',
          tone: 'yellow',
        },
      ],
    },
    {
      id: 'negative',
      segments: [
        { type: 'text', key: 'safety_detail_bullet_3_text_1' },
        { type: 'metric', key: 'unsafe_total' },
        { type: 'text', key: 'safety_detail_bullet_3_text_2' },
        { type: 'metric', key: 'rather_unsafe' },
        { type: 'text', key: 'safety_detail_bullet_3_text_3' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_3_highlight_1',
          tone: 'orange-soft',
        },
        { type: 'text', key: 'safety_detail_bullet_3_text_4' },
        { type: 'metric', key: 'very_unsafe' },
        { type: 'text', key: 'safety_detail_bullet_3_text_5' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_3_highlight_2',
          tone: 'orange-light',
        },
      ],
    },
    {
      id: 'no-answer',
      segments: [
        { type: 'metric', key: 'no_answer' },
        { type: 'text', key: 'safety_detail_bullet_4_text_1' },
        {
          type: 'highlight',
          key: 'safety_detail_bullet_4_highlight_1',
          tone: 'taupe-light',
        },
        { type: 'text', key: 'safety_detail_bullet_4_text_2' },
      ],
    },
  ],
  treeItems: [
    { id: 'no-answer', metricKey: 'no_answer', imageKey: 'tree1', tone: 'taupe-light' },
    { id: 'very-safe', metricKey: 'very_safe', imageKey: 'tree4', tone: 'blue' },
    { id: 'rather-safe', metricKey: 'rather_safe', imageKey: 'tree5', tone: 'mint' },
    { id: 'rather-unsafe', metricKey: 'rather_unsafe', imageKey: 'tree5', tone: 'orange-soft' },
    { id: 'very-unsafe', metricKey: 'very_unsafe', imageKey: 'tree2', tone: 'orange-light' },
    { id: 'neutral', metricKey: 'neutral', imageKey: 'tree3', tone: 'yellow' },
  ],
}

export const othersQuestionStory = {
  sectionId: 'others-question',
  titleKey: 'others_question_intro',
  metricOrder: [],
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  bubble: [],
}

export const othersAnswersStory = {
  sectionId: 'others-answers',
  titleKey: 'others_answers_reflection',
  metricOrder: [],
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  bubble: [],
}

export const othersAcceptanceInfo = {
  titleKey: null,
  metricsByTransportation: {
    bike: {
      default: {
        very_satisfied: 2,
        satisfied: 10,
        neutral: 28,
        dissatisfied: 28,
        very_dissatisfied: 12,
        no_answer: 20,
      },
    },
    car: {
      default: {
        very_satisfied: 2,
        satisfied: 10,
        neutral: 28,
        dissatisfied: 28,
        very_dissatisfied: 12,
        no_answer: 20,
      },
    },
    bus: {
      default: {
        very_satisfied: 2,
        satisfied: 10,
        neutral: 28,
        dissatisfied: 28,
        very_dissatisfied: 12,
        no_answer: 20,
      },
    },
    walk: {
      default: {
        very_satisfied: 2,
        satisfied: 10,
        neutral: 28,
        dissatisfied: 28,
        very_dissatisfied: 12,
        no_answer: 20,
      },
    },
  },
  bubble: [
    {
      id: 'positive',
      segments: [
        { type: 'text', key: 'others_acceptance_bullet_1_text_1' },
        { type: 'metric', key: 'very_satisfied' },
        { type: 'text', key: 'others_acceptance_bullet_1_text_2' },
        {
          type: 'highlight',
          key: 'others_acceptance_bullet_1_highlight_1',
          tone: 'blue',
        },
        { type: 'text', key: 'others_acceptance_bullet_1_text_3' },
        { type: 'metric', key: 'satisfied' },
        { type: 'text', key: 'others_acceptance_bullet_1_text_4' },
        {
          type: 'highlight',
          key: 'others_acceptance_bullet_1_highlight_2',
          tone: 'mint',
        },
      ],
    },
    {
      id: 'mixed',
      segments: [
        { type: 'metric', key: 'neutral' },
        { type: 'text', key: 'others_acceptance_bullet_2_text_1' },
        {
          type: 'highlight',
          key: 'others_acceptance_bullet_2_highlight_1',
          tone: 'yellow',
        },
        { type: 'text', key: 'others_acceptance_bullet_2_text_2' },
        { type: 'metric', key: 'dissatisfied_total' },
        { type: 'text', key: 'others_acceptance_bullet_2_text_3' },
        {
          type: 'highlight',
          key: 'others_acceptance_bullet_2_highlight_2',
          tone: 'orange-soft',
        },
        { type: 'text', key: 'others_acceptance_bullet_2_text_4' },
      ],
    },
    {
      id: 'no-answer',
      segments: [
        { type: 'metric', key: 'no_answer' },
        { type: 'text', key: 'others_acceptance_bullet_3_text_1' },
        {
          type: 'highlight',
          key: 'others_acceptance_bullet_3_highlight_1',
          tone: 'taupe-light',
        },
        { type: 'text', key: 'others_acceptance_bullet_3_text_2' },
      ],
    },
  ],
}

export const conclusionStory = {
  sectionId: 'conclusion',
  titleKey: 'conclusion_intro_question',
  metricOrder: [],
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  bubble: [],
}

export const endStory = {
  sectionId: 'end',
  titleKey: 'end_closing_message',
  metricOrder: [],
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  bubble: [],
}

export const conclusionSummaryInfo = {
  metricsByTransportation: {
    bike: {
      default: {},
    },
    car: {
      default: {},
    },
    bus: {
      default: {},
    },
    walk: {
      default: {},
    },
  },
  blocks: [
    {
      id: 'paragraph-1',
      type: 'paragraph',
      segments: [
        { type: 'highlight', key: 'conclusion_summary_paragraph_1_highlight_1' },
        { type: 'text', key: 'conclusion_summary_paragraph_1_text_1' },
        { type: 'highlight', key: 'conclusion_summary_paragraph_1_highlight_2' },
        { type: 'text', key: 'conclusion_summary_paragraph_1_text_2' },
      ],
    },
    {
      id: 'paragraph-2',
      type: 'paragraph',
      segments: [
        { type: 'highlight', key: 'conclusion_summary_paragraph_2_highlight_1' },
        { type: 'text', key: 'conclusion_summary_paragraph_2_text_1' },
      ],
    },
    {
      id: 'paragraph-3',
      type: 'paragraph',
      segments: [
        { type: 'highlight', key: 'conclusion_summary_paragraph_3_highlight_1' },
        { type: 'text', key: 'conclusion_summary_paragraph_3_text_1' },
        { type: 'highlight', key: 'conclusion_summary_paragraph_3_highlight_2' },
        { type: 'text', key: 'conclusion_summary_paragraph_3_text_2' },
      ],
    },
  ],
}

export const conclusionTransportUsage = [
  {
    id: 'tram',
    imageKey: 'tram',
    labelKey: 'transportation_bus',
    value: 26,
  },
  {
    id: 'car',
    assetKey: 'end-car',
    labelKey: 'transportation_car',
    value: 21,
  },
  {
    id: 'bike',
    assetKey: 'rider',
    labelKey: 'transportation_bike',
    value: 22,
  },
  {
    id: 'walkers',
    imageKey: 'people-walking',
    labelKey: 'transportation_walk',
    value: 48,
  },
]

export const othersEbikesInfo = {
  metricsByTransportation: {
    bike: {
      default: {
        households_ebike_total: 13,
        households_ebike_one: 9,
        households_ebike_two_plus: 4,
      },
    },
    car: {
      default: {
        households_ebike_total: 13,
        households_ebike_one: 9,
        households_ebike_two_plus: 4,
      },
    },
    bus: {
      default: {
        households_ebike_total: 13,
        households_ebike_one: 9,
        households_ebike_two_plus: 4,
      },
    },
    walk: {
      default: {
        households_ebike_total: 13,
        households_ebike_one: 9,
        households_ebike_two_plus: 4,
      },
    },
  },
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      segments: [
        { type: 'metric', key: 'households_ebike_total' },
        { type: 'text', key: 'others_ebike_intro_text_1' },
        { type: 'highlight', key: 'others_ebike_intro_highlight_1' },
        { type: 'text', key: 'others_ebike_intro_text_2' },
      ],
    },
    {
      id: 'one-ebike',
      type: 'bullet',
      segments: [
        { type: 'metric', key: 'households_ebike_one' },
        { type: 'text', key: 'others_ebike_bullet_1_text_1' },
      ],
    },
    {
      id: 'more-ebikes',
      type: 'bullet',
      segments: [
        { type: 'metric', key: 'households_ebike_two_plus' },
        { type: 'text', key: 'others_ebike_bullet_2_text_1' },
      ],
    },
  ],
}

export const othersBikeSharingInfo = {
  metricsByTransportation: {
    bike: {
      default: {
        bikesharing_very_satisfied: 8,
        bikesharing_satisfied: 19,
        bikesharing_dissatisfied_total: 2,
        bikesharing_no_opinion: 64,
      },
    },
    car: {
      default: {
        bikesharing_very_satisfied: 8,
        bikesharing_satisfied: 19,
        bikesharing_dissatisfied_total: 2,
        bikesharing_no_opinion: 64,
      },
    },
    bus: {
      default: {
        bikesharing_very_satisfied: 8,
        bikesharing_satisfied: 19,
        bikesharing_dissatisfied_total: 2,
        bikesharing_no_opinion: 64,
      },
    },
    walk: {
      default: {
        bikesharing_very_satisfied: 8,
        bikesharing_satisfied: 19,
        bikesharing_dissatisfied_total: 2,
        bikesharing_no_opinion: 64,
      },
    },
  },
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      segments: [
        { type: 'text', key: 'others_bikesharing_intro_text_1' },
        { type: 'highlight', key: 'others_bikesharing_intro_highlight_1' },
        { type: 'text', key: 'others_bikesharing_intro_text_2' },
      ],
    },
    {
      id: 'positive',
      type: 'bullet',
      segments: [
        { type: 'metric', key: 'bikesharing_very_satisfied' },
        { type: 'text', key: 'others_bikesharing_bullet_1_text_1' },
        { type: 'metric', key: 'bikesharing_satisfied' },
        { type: 'text', key: 'others_bikesharing_bullet_1_text_2' },
      ],
    },
    {
      id: 'negative',
      type: 'bullet',
      segments: [
        { type: 'text', key: 'others_bikesharing_bullet_2_text_1' },
        { type: 'metric', key: 'bikesharing_dissatisfied_total' },
        { type: 'text', key: 'others_bikesharing_bullet_2_text_2' },
      ],
    },
    {
      id: 'no-opinion',
      type: 'bullet',
      segments: [
        { type: 'metric', key: 'bikesharing_no_opinion' },
        { type: 'text', key: 'others_bikesharing_bullet_3_text_1' },
      ],
    },
  ],
}

export const storyScenes = {
  [accessibilityHappinessStory.sectionId]: accessibilityHappinessStory,
  [accessibilityRoadStory.sectionId]: accessibilityRoadStory,
  [safetyStory.sectionId]: safetyStory,
  [othersQuestionStory.sectionId]: othersQuestionStory,
  [othersAnswersStory.sectionId]: othersAnswersStory,
  [conclusionStory.sectionId]: conclusionStory,
  [endStory.sectionId]: endStory,
}
