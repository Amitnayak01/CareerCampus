/**
 * Rule-based Career Recommendation Engine
 * Matches student profile to career paths based on qualification, stream, and interests
 */

const recommendationRules = {
  // Stream → eligible categories
  streamCareerMap: {
    science: ['technology', 'medical', 'engineering', 'science', 'design'],
    commerce: ['business', 'finance', 'law', 'education'],
    arts: ['arts', 'design', 'law', 'education', 'government'],
    engineering: ['technology', 'engineering', 'science'],
    medical: ['medical', 'science'],
    management: ['business', 'finance', 'education'],
    other: ['technology', 'business', 'arts', 'design']
  },
  // Interest → career categories
  interestCareerMap: {
    technology: ['technology', 'engineering'],
    medical: ['medical', 'science'],
    business: ['business', 'finance'],
    arts: ['arts', 'design'],
    law: ['law', 'government'],
    education: ['education'],
    science: ['science', 'medical', 'engineering'],
    design: ['design', 'arts'],
    finance: ['finance', 'business'],
    government: ['government', 'law'],
    agriculture: ['agriculture', 'science'],
    sports: ['education', 'arts']
  },
  // Qualification level scoring
  qualificationScore: {
    '10th': 1, 'diploma': 2, '12th': 2, 'graduation': 3, 'post-graduation': 4, 'other': 2
  }
};

/**
 * Calculate match score between student profile and a career
 */
const calculateMatchScore = (career, studentProfile) => {
  let score = 0;
  const reasons = [];
  const { qualification, stream, interests } = studentProfile;

  // Stream match (30 points)
  const eligibleCategories = recommendationRules.streamCareerMap[stream] || [];
  if (eligibleCategories.includes(career.category)) {
    score += 30;
    reasons.push(`Your ${stream} background aligns well with this career`);
  }

  // Interest match (40 points)
  let interestScore = 0;
  const matchedInterests = [];
  interests.forEach(interest => {
    const categories = recommendationRules.interestCareerMap[interest] || [];
    if (categories.includes(career.category)) {
      interestScore += 20;
      matchedInterests.push(interest);
    }
  });
  score += Math.min(interestScore, 40);
  if (matchedInterests.length > 0) {
    reasons.push(`Matches your interest in ${matchedInterests.join(', ')}`);
  }

  // Qualification match (20 points)
  const studentLevel = recommendationRules.qualificationScore[qualification] || 2;
  const minLevel = recommendationRules.qualificationScore[career.eligibility?.minQualification] || 2;
  if (studentLevel >= minLevel) {
    score += 20;
    reasons.push('You meet the minimum qualification requirement');
  } else {
    score -= 10;
    reasons.push(`Requires higher qualification (${career.eligibility?.minQualification})`);
  }

  // Demand level bonus (10 points)
  const demandBonus = { 'very-high': 10, 'high': 7, 'medium': 4, 'low': 1 };
  score += demandBonus[career.demandLevel] || 4;
  if (career.demandLevel === 'very-high' || career.demandLevel === 'high') {
    reasons.push('High demand in the job market');
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
};

/**
 * Generate job opportunities based on profile
 */
const generateJobOpportunities = (careers, qualification, stream) => {
  const jobs = new Set();
  careers.slice(0, 5).forEach(item => {
    if (item.career.jobRoles) {
      item.career.jobRoles.slice(0, 3).forEach(job => jobs.add(job));
    }
  });
  return Array.from(jobs).slice(0, 10);
};

/**
 * Generate certification suggestions
 */
const generateCertifications = (careers) => {
  const certs = new Set();
  careers.slice(0, 5).forEach(item => {
    if (item.career.certifications) {
      item.career.certifications.slice(0, 2).forEach(cert => certs.add(cert));
    }
  });
  return Array.from(certs).slice(0, 8);
};

/**
 * Generate higher studies options
 */
const generateHigherStudies = (careers, qualification) => {
  const studies = new Set();
  careers.slice(0, 5).forEach(item => {
    if (item.career.higherStudies) {
      item.career.higherStudies.slice(0, 2).forEach(s => studies.add(s));
    }
  });
  return Array.from(studies).slice(0, 6);
};

/**
 * Generate career roadmap
 */
const generateRoadmap = (topCareer, qualification) => {
  if (!topCareer) return [];
  const steps = [];
  const level = recommendationRules.qualificationScore[qualification] || 2;
  if (level < 3) steps.push('Complete your graduation in a relevant field');
  steps.push(`Build core skills: ${(topCareer.career.requiredSkills || []).slice(0, 3).join(', ')}`);
  if (topCareer.career.certifications?.length) {
    steps.push(`Get certified: ${topCareer.career.certifications[0]}`);
  }
  steps.push('Work on internships or entry-level projects to gain experience');
  steps.push('Build a strong portfolio or resume showcasing your skills');
  steps.push(`Apply for entry-level roles like: ${(topCareer.career.jobRoles || ['Junior Developer'])[0]}`);
  steps.push('Continue learning and upskilling with advanced certifications');
  return steps;
};

module.exports = {
  calculateMatchScore,
  generateJobOpportunities,
  generateCertifications,
  generateHigherStudies,
  generateRoadmap
};
