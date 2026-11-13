module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost/"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1000 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 1400 }],
        "total-blocking-time": ["error", { maxNumericValue: 85 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.02 }],
        "total-byte-weight": ["error", { maxNumericValue: 1153434 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
