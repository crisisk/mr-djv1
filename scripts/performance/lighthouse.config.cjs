module.exports = {
  extends: 'lighthouse:default',
  settings: {
    throttlingMethod: 'simulate',
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 2.625,
      disabled: false
    },
    auditMode: false,
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  }
};
