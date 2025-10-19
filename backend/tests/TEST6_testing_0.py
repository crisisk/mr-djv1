import { PercyOptions } from '@percy/core';

export interface VisualTestConfig {
  name: string;
  viewport?: {
    width: number;
    height: number;
  };
  waitForSelector?: string;
  waitForTimeout?: number;
}

export class VisualTestHelper {
  private static readonly DEFAULT_TIMEOUT = 5000;

  /**
   * Takes a snapshot with Percy
   * @param config Test configuration options
   * @param element Optional element to snapshot (defaults to entire page)
   */
  public static async takeSnapshot(
    config: VisualTestConfig,
    element?: Element
  ): Promise<void> {
    try {
      // Wait for any specified conditions
      if (config.waitForSelector) {
        await this.waitForElement(config.waitForSelector, config.waitForTimeout);
      }

      // Set viewport if specified
      if (config.viewport) {
        await page.setViewport(config.viewport);
      }

      // Take Percy snapshot
      await percySnapshot(config.name, {
        widths: [config.viewport?.width || 1280],
        scope: element,
        minHeight: config.viewport?.height || 1024,
      });
    } catch (error) {
      console.error(`Failed to take Percy snapshot: ${error.message}`);
      throw error;
    }
  }

  /**
   * Waits for an element to be present in the DOM
   */
  private static async waitForElement(
    selector: string,
    timeout?: number
  ): Promise<void> {
    try {
      await page.waitForSelector(
        selector,
        { timeout: timeout || this.DEFAULT_TIMEOUT }
      );
    } catch (error) {
      throw new Error(`Element ${selector} not found: ${error.message}`);
    }
  }
}
