/**
 * CRO Smart Variant Generator
 * Automatically generates test variants based on available assets and ML insights
 */

const fs = require('fs').promises;
const path = require('path');

class VariantGenerator {
  constructor(config = null) {
    this.config = config || require('../../config/cro-config.json');
    this.mediaManifestPath = path.join(__dirname, '../../../frontend/public/media/media-manifest.json');
  }

  /**
   * Load media manifest
   */
  async loadMediaManifest() {
    try {
      const data = await fs.readFile(this.mediaManifestPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading media manifest:', error);
      return null;
    }
  }

  /**
   * Generate test hypotheses based on available assets
   */
  async generateTestHypotheses(currentPerformance = null) {
    const manifest = await this.loadMediaManifest();
    if (!manifest) return [];

    const hypotheses = [];

    // Hero image/video tests
    hypotheses.push(...this.generateHeroVariants(manifest));

    // Gallery arrangement tests
    hypotheses.push(...this.generateGalleryVariants(manifest));

    // CTA button tests
    hypotheses.push(...this.generateCTAVariants());

    // Layout tests
    hypotheses.push(...this.generateLayoutVariants());

    // Content order tests
    hypotheses.push(...this.generateContentOrderVariants());

    // Event-specific tests
    hypotheses.push(...this.generateEventSpecificVariants(manifest));

    // Score and prioritize hypotheses
    return this.prioritizeHypotheses(hypotheses, currentPerformance);
  }

  /**
   * Generate hero section variants
   */
  generateHeroVariants(manifest) {
    const variants = [];

    // Video vs Image
    if (manifest.videos?.hero?.length > 0) {
      variants.push({
        type: 'hero_content',
        hypothesis: 'Video hero increases engagement vs static image',
        variants: [
          {
            name: 'Hero Video',
            config: {
              type: 'video',
              asset: manifest.videos.hero[0]
            }
          },
          {
            name: 'Hero Image',
            config: {
              type: 'image',
              asset: manifest.gallery.parties[0]
            }
          }
        ],
        priority: 'high',
        expectedImpact: 'high',
        reasoning: 'Video content typically drives higher engagement and emotional connection'
      });
    }

    // Different video lengths
    if (manifest.videos?.hero?.length > 2) {
      const shortVideos = manifest.videos.hero.filter(v => v.duration <= 20);
      const longVideos = manifest.videos.hero.filter(v => v.duration > 20);

      if (shortVideos.length > 0 && longVideos.length > 0) {
        variants.push({
          type: 'hero_video_length',
          hypothesis: 'Short videos (< 20s) convert better than longer videos',
          variants: [
            {
              name: 'Short Video',
              config: {
                type: 'video',
                asset: shortVideos[0]
              }
            },
            {
              name: 'Long Video',
              config: {
                type: 'video',
                asset: longVideos[0]
              }
            }
          ],
          priority: 'medium',
          expectedImpact: 'medium',
          reasoning: 'Short attention spans favor concise content'
        });
      }
    }

    // Wedding vs Party imagery
    if (manifest.gallery?.weddings?.length > 0 && manifest.gallery?.parties?.length > 0) {
      variants.push({
        type: 'hero_event_type',
        hypothesis: 'Wedding imagery appeals to broader audience vs party images',
        variants: [
          {
            name: 'Wedding Hero',
            config: {
              type: 'image',
              asset: manifest.gallery.weddings[0]
            }
          },
          {
            name: 'Party Hero',
            config: {
              type: 'image',
              asset: manifest.gallery.parties[0]
            }
          }
        ],
        priority: 'high',
        expectedImpact: 'high',
        reasoning: 'Different event types may resonate with different target audiences'
      });
    }

    return variants;
  }

  /**
   * Generate gallery arrangement variants
   */
  generateGalleryVariants(manifest) {
    const variants = [];

    // Wedding-first vs Party-first
    if (manifest.gallery?.weddings && manifest.gallery?.parties) {
      variants.push({
        type: 'gallery_order',
        hypothesis: 'Leading with wedding photos increases conversions',
        variants: [
          {
            name: 'Weddings First',
            config: {
              order: ['weddings', 'parties']
            }
          },
          {
            name: 'Parties First',
            config: {
              order: ['parties', 'weddings']
            }
          }
        ],
        priority: 'medium',
        expectedImpact: 'medium',
        reasoning: 'Wedding clients often have higher budgets and conversion intent'
      });
    }

    // Grid size variations
    variants.push({
      type: 'gallery_grid',
      hypothesis: 'Larger grid (3x3) shows more content and increases engagement',
      variants: [
        {
          name: 'Small Grid (2x2)',
          config: { columns: 2, rows: 2 }
        },
        {
          name: 'Medium Grid (3x3)',
          config: { columns: 3, rows: 3 }
        },
        {
          name: 'Large Grid (4x3)',
          config: { columns: 4, rows: 3 }
        }
      ],
      priority: 'low',
      expectedImpact: 'low',
      reasoning: 'Balance between showing variety and avoiding overwhelm'
    });

    return variants;
  }

  /**
   * Generate CTA button variants
   */
  generateCTAVariants() {
    const variants = [];

    // Button text
    variants.push({
      type: 'cta_text',
      hypothesis: 'Urgent CTA text increases conversion rate',
      variants: [
        {
          name: 'Standard CTA',
          config: {
            text: 'Vraag offerte aan',
            style: 'primary'
          }
        },
        {
          name: 'Urgent CTA',
          config: {
            text: 'Beschikbaarheid checken',
            style: 'primary'
          }
        },
        {
          name: 'Value CTA',
          config: {
            text: 'Gratis offerte aanvragen',
            style: 'primary'
          }
        }
      ],
      priority: 'high',
      expectedImpact: 'high',
      reasoning: 'CTA copy directly impacts conversion decisions'
    });

    // Button color
    variants.push({
      type: 'cta_color',
      hypothesis: 'Red/orange buttons create urgency and higher CTR vs blue',
      variants: [
        {
          name: 'Blue Button',
          config: {
            color: '#007bff',
            text: 'Vraag offerte aan'
          }
        },
        {
          name: 'Orange Button',
          config: {
            color: '#ff6600',
            text: 'Vraag offerte aan'
          }
        },
        {
          name: 'Red Button',
          config: {
            color: '#dc3545',
            text: 'Vraag offerte aan'
          }
        }
      ],
      priority: 'medium',
      expectedImpact: 'medium',
      reasoning: 'Warm colors can create sense of urgency'
    });

    // Button placement
    variants.push({
      type: 'cta_placement',
      hypothesis: 'Sticky CTA button increases conversions vs static placement',
      variants: [
        {
          name: 'Static CTA',
          config: {
            position: 'hero',
            sticky: false
          }
        },
        {
          name: 'Sticky CTA',
          config: {
            position: 'header',
            sticky: true
          }
        }
      ],
      priority: 'medium',
      expectedImpact: 'medium',
      reasoning: 'Persistent visibility increases conversion opportunities'
    });

    return variants;
  }

  /**
   * Generate page layout variants
   */
  generateLayoutVariants() {
    const variants = [];

    // Content order
    variants.push({
      type: 'content_order',
      hypothesis: 'Social proof early (testimonials first) increases trust and conversions',
      variants: [
        {
          name: 'Traditional Order',
          config: {
            sections: ['hero', 'services', 'gallery', 'testimonials', 'contact']
          }
        },
        {
          name: 'Social Proof First',
          config: {
            sections: ['hero', 'testimonials', 'services', 'gallery', 'contact']
          }
        }
      ],
      priority: 'medium',
      expectedImpact: 'medium',
      reasoning: 'Early credibility signals can improve conversion rates'
    });

    // Form placement
    variants.push({
      type: 'form_placement',
      hypothesis: 'Contact form in hero section increases immediate conversions',
      variants: [
        {
          name: 'Form at Bottom',
          config: {
            position: 'footer'
          }
        },
        {
          name: 'Form in Hero',
          config: {
            position: 'hero'
          }
        }
      ],
      priority: 'high',
      expectedImpact: 'high',
      reasoning: 'Reducing friction to conversion point increases submissions'
    });

    return variants;
  }

  /**
   * Generate content order variants
   */
  generateContentOrderVariants() {
    const variants = [];

    variants.push({
      type: 'testimonial_placement',
      hypothesis: 'Video testimonials above text testimonials increases credibility',
      variants: [
        {
          name: 'Text First',
          config: {
            order: 'text_then_video'
          }
        },
        {
          name: 'Video First',
          config: {
            order: 'video_then_text'
          }
        }
      ],
      priority: 'medium',
      expectedImpact: 'medium',
      reasoning: 'Video testimonials are more authentic and persuasive'
    });

    return variants;
  }

  /**
   * Generate event-specific variants
   */
  generateEventSpecificVariants(manifest) {
    const variants = [];

    // Wedding-specific landing page
    if (manifest.gallery?.weddings?.length > 0) {
      variants.push({
        type: 'event_specific_landing',
        hypothesis: 'Wedding-specific landing page converts better for wedding traffic',
        variants: [
          {
            name: 'Generic Landing Page',
            config: {
              type: 'generic',
              gallery: ['parties', 'weddings']
            }
          },
          {
            name: 'Wedding Landing Page',
            config: {
              type: 'wedding_specific',
              gallery: ['weddings'],
              copy: 'wedding_focused'
            }
          }
        ],
        priority: 'high',
        expectedImpact: 'high',
        reasoning: 'Personalized experience increases relevance and conversion',
        targetAudience: 'wedding_traffic'
      });
    }

    return variants;
  }

  /**
   * Prioritize hypotheses based on expected impact and current performance
   */
  prioritizeHypotheses(hypotheses, currentPerformance) {
    // Score each hypothesis
    const scored = hypotheses.map(h => {
      let score = 0;

      // Priority score
      if (h.priority === 'high') score += 10;
      else if (h.priority === 'medium') score += 5;
      else score += 2;

      // Expected impact score
      if (h.expectedImpact === 'high') score += 10;
      else if (h.expectedImpact === 'medium') score += 5;
      else score += 2;

      // Ease of implementation (fewer variants = easier)
      score += (5 - h.variants.length);

      return {
        ...h,
        priorityScore: score
      };
    });

    // Sort by score
    return scored.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Generate specific variant configuration
   */
  async generateVariantConfig(hypothesis, variantIndex) {
    const variant = hypothesis.variants[variantIndex];

    return {
      testType: hypothesis.type,
      variantName: variant.name,
      config: variant.config,
      hypothesis: hypothesis.hypothesis,
      expectedImpact: hypothesis.expectedImpact,
      reasoning: hypothesis.reasoning
    };
  }

  /**
   * Analyze image characteristics for intelligent matching
   */
  analyzeImageCharacteristics(imageAsset) {
    // Basic analysis based on dimensions
    const aspectRatio = imageAsset.dimensions.width / imageAsset.dimensions.height;

    return {
      aspectRatio: aspectRatio.toFixed(2),
      orientation: aspectRatio > 1.2 ? 'landscape' : aspectRatio < 0.8 ? 'portrait' : 'square',
      resolution: imageAsset.dimensions.width * imageAsset.dimensions.height,
      category: imageAsset.category,
      subcategory: imageAsset.subcategory,
      // These would ideally come from image analysis ML
      estimatedCharacteristics: {
        hasPeople: imageAsset.subcategory === 'parties' || imageAsset.subcategory === 'weddings',
        isCloseup: aspectRatio < 1.5,
        isWideShot: aspectRatio > 2,
        eventType: imageAsset.subcategory
      }
    };
  }

  /**
   * Generate variants based on image characteristics
   */
  async generateImageCharacteristicTests(manifest) {
    const variants = [];

    // Analyze all images
    const allImages = [
      ...manifest.gallery.parties.map(img => ({ ...img, type: 'party' })),
      ...manifest.gallery.weddings.map(img => ({ ...img, type: 'wedding' }))
    ];

    const analyzed = allImages.map(img => ({
      ...img,
      characteristics: this.analyzeImageCharacteristics(img)
    }));

    // Close-up vs Wide shot
    const closeups = analyzed.filter(img => img.characteristics.estimatedCharacteristics.isCloseup);
    const wideShots = analyzed.filter(img => img.characteristics.estimatedCharacteristics.isWideShot);

    if (closeups.length > 0 && wideShots.length > 0) {
      variants.push({
        type: 'image_framing',
        hypothesis: 'Close-up shots create emotional connection vs wide venue shots',
        variants: [
          {
            name: 'Close-up Shot',
            config: {
              type: 'image',
              asset: closeups[0]
            }
          },
          {
            name: 'Wide Shot',
            config: {
              type: 'image',
              asset: wideShots[0]
            }
          }
        ],
        priority: 'medium',
        expectedImpact: 'medium',
        reasoning: 'Emotional connection vs venue showcase'
      });
    }

    return variants;
  }

  /**
   * Generate challenger variant for current champion
   */
  async generateChallenger(currentChampion, performanceData) {
    const manifest = await this.loadMediaManifest();
    if (!manifest) return null;

    // Analyze what made the champion successful
    const championCharacteristics = this.analyzeChampionSuccess(currentChampion, performanceData);

    // Generate similar but slightly different variant
    return this.findSimilarVariant(championCharacteristics, manifest);
  }

  /**
   * Analyze champion success factors
   */
  analyzeChampionSuccess(champion, performanceData) {
    return {
      assetType: champion.config.type,
      eventCategory: champion.config.asset?.subcategory,
      conversionRate: performanceData.conversionRate,
      engagementScore: performanceData.engagementScore,
      characteristics: champion.config.asset ? this.analyzeImageCharacteristics(champion.config.asset) : {}
    };
  }

  /**
   * Find similar variant to test against champion
   */
  findSimilarVariant(characteristics, manifest) {
    // Find assets with similar characteristics
    const category = characteristics.eventCategory;
    let assets = [];

    if (category === 'weddings') {
      assets = manifest.gallery.weddings;
    } else if (category === 'parties') {
      assets = manifest.gallery.parties;
    }

    // Pick a different asset from same category
    if (assets.length > 1) {
      return {
        name: `${category} variant`,
        config: {
          type: characteristics.assetType,
          asset: assets[1] // Different from champion
        }
      };
    }

    return null;
  }
}

module.exports = VariantGenerator;
