export const formatSalary = (salary) => salary || 'Not specified';

export const getDemandColor = (level) => {
  const map = {
    'very-high': 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400',
    'high': 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400',
    'medium': 'text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400',
    'low': 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400'
  };
  return map[level] || map['medium'];
};

export const getDifficultyColor = (level) => {
  const map = {
    'easy': 'text-emerald-600 bg-emerald-100',
    'moderate': 'text-amber-600 bg-amber-100',
    'hard': 'text-red-600 bg-red-100'
  };
  return map[level] || map['moderate'];
};

export const getCategoryIcon = (category) => {
  const icons = {
    technology: '💻', medical: '🩺', business: '💼', arts: '🎨',
    engineering: '⚙️', law: '⚖️', education: '📚', science: '🔬',
    design: '🖥️', finance: '📈', government: '🏛️', agriculture: '🌾', other: '🎯'
  };
  return icons[category] || '🎯';
};

export const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '...' : str;

export const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const QUALIFICATIONS = [
  { value: '10th', label: '10th Standard' },
  { value: '12th', label: '12th Standard' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'post-graduation', label: 'Post Graduation' },
  { value: 'other', label: 'Other' }
];

export const STREAMS = [
  { value: 'science', label: 'Science (PCM/PCB)' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts / Humanities' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'management', label: 'Management' },
  { value: 'other', label: 'Other' }
];

export const INTERESTS = [
  'Technology', 'Medical', 'Business', 'Arts', 'Law', 'Education',
  'Science', 'Design', 'Finance', 'Government', 'Agriculture', 'Sports'
];

export const CATEGORIES = [
  'all', 'technology', 'medical', 'business', 'arts', 'engineering',
  'law', 'education', 'science', 'design', 'finance', 'government', 'agriculture'
];
