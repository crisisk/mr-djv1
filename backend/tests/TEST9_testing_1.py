#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const config = require('../audit-config');

class SecurityAudit {
  constructor(config) {
    this.config = config;
    this.results = {
      npmAudit: null,
      snykTest: null,
    };
  }

  async runNpmAudit() {
    try {
      console.log('Running npm audit...');
      
      return new Promise((resolve, reject) => {
        exec('npm audit --json', (error, stdout, stderr) => {
          if (error && !stdout) {
            reject(error);
            return;
          }

          const auditResults = JSON.parse(stdout);
          this.results.npmAudit = auditResults;
          resolve(auditResults);
        });
      });
    } catch (error) {
      console.error('Error running npm audit:', error);
      throw error;
    }
  }

  async runSnykTest() {
    try {
      console.log('Running Snyk test...');
      
      return new Promise((resolve, reject) => {
        exec('snyk test --json', (error, stdout, stderr) => {
          if (error && !stdout) {
            reject(error);
            return;
          }

          const snykResults = JSON.parse(stdout);
          this.results.snykTest = snykResults;
          resolve(snykResults);
        });
      });
    } catch (error) {
      console.error('Error running Snyk test:', error);
      throw error;
    }
  }

  analyzeSeverity(results) {
    const criticalIssues = [];
    const highIssues = [];

    // Analyze npm audit results
    if (results.npmAudit && results.npmAudit.advisories) {
      Object.values(results.npmAudit.advisories).forEach(advisory => {
        if (advisory.severity === 'critical') {
          criticalIssues.push({
            source: 'npm',
            ...advisory
          });
        } else if (advisory.severity === 'high') {
          highIssues.push({
            source: 'npm',
            ...advisory
          });
        }
      });
    }

    // Analyze Snyk results
    if (results.snykTest && results.snykTest.vulnerabilities) {
      results.snykTest.vulnerabilities.forEach(vuln => {
        if (vuln.severity === 'critical') {
          criticalIssues.push({
            source: 'snyk',
            ...vuln
          });
        } else if (vuln.severity === 'high') {
          highIssues.push({
            source: 'snyk',
            ...vuln
          });
        }
      });
    }

    return { criticalIssues, highIssues };
  }

  generateReport() {
    const { criticalIssues, highIssues } = this.analyzeSeverity(this.results);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        criticalCount: criticalIssues.length,
        highCount: highIssues.length,
      },
      criticalIssues,
      highIssues,
      fullResults: this.results
    };

    if (this.config.reporting.outputFile) {
      fs.writeFileSync(
        this.config.reporting.outputFile,
        JSON.stringify(report, null, 2)
      );
    }

    return report;
  }

  shouldFailBuild(report) {
    const { failOn } = this.config;
    
    if (failOn.includes('critical') && report.summary.criticalCount > 0) {
      return true;
    }
    
    if (failOn.includes('high') && report.summary.highCount > 0) {
      return true;
    }

    return false;
  }

  async run() {
    try {
      await this.runNpmAudit();
      await this.runSnykTest();
      
      const report = this.generateReport();
      
      if (this.shouldFailBuild(report)) {
        console.error('Security audit failed! Check security-report.json for details.');
        process.exit(1);
      }
      
      console.log('Security audit passed successfully!');
    } catch (error) {
      console.error('Security audit failed with error:', error);
      process.exit(1);
    }
  }
}

// Run the security audit
const audit = new SecurityAudit(config);
audit.run();
