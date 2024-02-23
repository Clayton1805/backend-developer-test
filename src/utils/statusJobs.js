const enumStatusJobs = {
  draft: 'draft',
  published: 'published',
  archived: 'archived',
  rejected: 'rejected',
};

const arrayStatusJobs = Object.values(enumStatusJobs);

module.exports = { enumStatusJobs, arrayStatusJobs };
