const POINTS_CONFIG = {
  contribution_types: {
    bug_fix: {
      label: 'Bug Fix',
      points: 10,
      description: 'Fix a bug in an open-source project'
    },
    feature: {
      label: 'Feature Addition',
      points: 25,
      description: 'Add a new feature to a project'
    },
    documentation: {
      label: 'Documentation',
      points: 5,
      description: 'Improve or add documentation'
    },
    code_review: {
      label: 'Code Review',
      points: 8,
      description: 'Review a pull request'
    },
    issue_report: {
      label: 'Issue Report',
      points: 3,
      description: 'Report a bug or suggest an enhancement'
    },
    test: {
      label: 'Test Addition',
      points: 12,
      description: 'Add test coverage to a project'
    },
    translation: {
      label: 'Translation',
      points: 7,
      description: 'Translate content or UI strings'
    },
    design: {
      label: 'Design',
      points: 15,
      description: 'Contribute designs or UX improvements'
    }
  },

  badges: [
    { name: 'First Contribution', description: 'Made your first contribution', threshold: 1, icon: '🌱' },
    { name: 'Getting Started', description: 'Earned 50 points', threshold: 50, icon: '⭐' },
    { name: 'Active Contributor', description: 'Earned 200 points', threshold: 200, icon: '🔥' },
    { name: 'Open Source Hero', description: 'Earned 500 points', threshold: 500, icon: '🦸' },
    { name: 'Legend', description: 'Earned 1000 points', threshold: 1000, icon: '👑' }
  ],

  rewards: [
    { name: '10% Course Discount', cost: 100, type: 'discount', description: '10% off any course on our partner platforms' },
    { name: '25% Course Discount', cost: 250, type: 'discount', description: '25% off any course on our partner platforms' },
    { name: 'Premium Content Access', cost: 150, type: 'content', description: '1 month access to premium tutorials' },
    { name: 'Mentorship Session', cost: 300, type: 'mentorship', description: '1-hour mentorship session with an expert' },
    { name: 'OSCT Swag Bundle', cost: 200, type: 'swag', description: 'T-shirt, stickers, and more' }
  ]
};

module.exports = POINTS_CONFIG;
