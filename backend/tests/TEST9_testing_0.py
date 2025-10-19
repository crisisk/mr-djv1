// Security audit configuration
module.exports = {
  // Severity levels to fail the build
  failOn: ['critical', 'high'],
  
  // Packages to ignore
  ignorePackages: [],
  
  // Custom audit rules
  rules: {
    'no-vulnerable-dependencies': true,
    'no-outdated-dependencies': true
  },
  
  // Reporting configuration
  reporting: {
    outputFormat: 'json',
    outputFile: 'security-report.json',
    notifyOnFail: true
  }
};
