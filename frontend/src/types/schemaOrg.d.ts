declare module "*schemaOrg.js" {
  export function generateOrganizationSchema(): Record<string, unknown>;
  export function generateLocalBusinessSchema(args: {
    city: string;
    province: string;
    slug: string;
    path?: string;
  }): Record<string, unknown>;
  export function generateEventSchema(args: {
    name?: string;
    description: string;
    city?: string;
    province?: string;
    startDate?: string;
    endDate?: string;
  }): Record<string, unknown>;
  export function generateBreadcrumbSchema(
    breadcrumbs: Array<{
      name: string;
      url: string;
    }>,
  ): Record<string, unknown>;
  export function generateServiceSchema(args: {
    serviceName: string;
    description: string;
    serviceType?: string;
  }): Record<string, unknown>;
  export function generateReviewSchema(args: {
    reviewBody: string;
    author: string;
    ratingValue: string | number;
    datePublished: string;
  }): Record<string, unknown>;
  export function generateFAQSchema(
    faqs: Array<{
      question: string;
      answer: string;
    }>,
  ): Record<string, unknown>;
  export function generateWebPageSchema(args: {
    title: string;
    description: string;
    url: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  }): Record<string, unknown>;
  export function generateProductSchema(args: {
    name: string;
    description: string;
    price: string | number;
    priceCurrency?: string;
  }): Record<string, unknown>;
}
