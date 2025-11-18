/**
 * Enhanced Performance Optimization Module
 * Advanced observability-integrated caching, lazy loading, and performance monitoring
 */

import React from "react";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  category: "timing" | "memory" | "cache" | "batch";
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private cache = new Map<string, any>();
  private metrics = new Map<string, number>();
  private performanceLog: PerformanceMetric[] = [];
  private maxLogSize = 1000;
  private slowOperationThreshold = 5000;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Enhanced cache management with observability
   */
  setCache(key: string, value: any, ttl: number = 300000): void {
    const expires = Date.now() + ttl;
    const valueSize = JSON.stringify(value).length;

    this.cache.set(key, { value, expires });

    // Record cache metric
    this.recordMetric({
      name: "cache_set",
      value: 1,
      unit: "count",
      category: "cache",
      metadata: { key, ttl, valueSize },
    });
  }

  /**
   * Enhanced cache retrieval with analytics
   */
  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) {
      this.recordMetric({
        name: "cache_miss",
        value: 1,
        unit: "count",
        category: "cache",
        metadata: { key },
      });
      return null;
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      this.recordMetric({
        name: "cache_expired",
        value: 1,
        unit: "count",
        category: "cache",
        metadata: { key, age: Date.now() - cached.expires },
      });
      return null;
    }

    // Cache hit
    this.recordMetric({
      name: "cache_hit",
      value: 1,
      unit: "count",
      category: "cache",
      metadata: { key },
    });

    return cached.value;
  }

  /**
   * Enhanced cache clearing with reporting
   */
  clearCache(): void {
    const cacheSize = this.cache.size;
    this.cache.clear();

    this.recordMetric({
      name: "cache_cleared",
      value: cacheSize,
      unit: "entries",
      category: "cache",
      metadata: { clearedEntries: cacheSize },
    });
  }

  /**
   * Enhanced performance timing with observability
   */
  startTimer(operation: string): void {
    this.metrics.set(operation, Date.now());
  }

  /**
   * Enhanced timer with detailed analytics
   */
  endTimer(operation: string): number {
    const startTime = this.metrics.get(operation);
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    this.metrics.delete(operation);

    // Record timing metric
    this.recordMetric({
      name: "operation_timing",
      value: duration,
      unit: "milliseconds",
      category: "timing",
      metadata: { operation },
    });

    // Enhanced slow operation detection
    if (duration > this.slowOperationThreshold) {
      this.recordMetric({
        name: "slow_operation",
        value: duration,
        unit: "milliseconds",
        category: "timing",
        metadata: {
          operation,
          duration,
          threshold: this.slowOperationThreshold,
          severity:
            duration > this.slowOperationThreshold * 2 ? "critical" : "warning",
        },
      });
    }

    return duration;
  }

  /**
   * Enhanced memory optimization with reporting
   */
  optimizeMemory(): void {
    const beforeSize = this.cache.size;
    const now = Date.now();

    // Clear expired cache entries
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expires) {
        this.cache.delete(key);
      }
    }

    const afterSize = this.cache.size;
    const cleanedEntries = beforeSize - afterSize;

    // Record memory optimization metrics
    if (cleanedEntries > 0) {
      this.recordMetric({
        name: "memory_optimization",
        value: cleanedEntries,
        unit: "entries",
        category: "memory",
        metadata: {
          cleanedEntries,
          beforeSize,
          afterSize,
        },
      });
    }

    // Force garbage collection if available
    if (global.gc) {
      try {
        global.gc();
        this.recordMetric({
          name: "garbage_collection",
          value: 1,
          unit: "count",
          category: "memory",
          metadata: { success: true },
        });
      } catch (error) {
        this.recordMetric({
          name: "garbage_collection",
          value: 0,
          unit: "count",
          category: "memory",
          metadata: { success: false, error: error.message },
        });
      }
    }
  }

  /**
   * Enhanced batch operations with observability
   */
  async batchOperations<T>(
    operations: (() => Promise<T>)[],
    concurrency: number = 5
  ): Promise<T[]> {
    const startTime = Date.now();
    const results: T[] = [];
    const batches = this.chunkArray(operations, concurrency);
    const totalBatches = batches.length;

    // Record batch start
    this.recordMetric({
      name: "batch_operations_start",
      value: operations.length,
      unit: "operations",
      category: "batch",
      metadata: {
        operationCount: operations.length,
        batchSize: concurrency,
        totalBatches,
      },
    });

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchStartTime = Date.now();

      try {
        const batchResults = await Promise.all(batch.map((op) => op()));
        results.push(...batchResults);

        // Record successful batch
        this.recordMetric({
          name: "batch_completed",
          value: batch.length,
          unit: "operations",
          category: "batch",
          metadata: {
            batchIndex: i,
            batchSize: batch.length,
            duration: Date.now() - batchStartTime,
          },
        });
      } catch (error) {
        // Record batch failure
        this.recordMetric({
          name: "batch_failed",
          value: 1,
          unit: "count",
          category: "batch",
          metadata: {
            batchIndex: i,
            batchSize: batch.length,
            error: error.message,
          },
        });
      }
    }

    // Record overall batch performance
    const totalDuration = Date.now() - startTime;
    this.recordMetric({
      name: "batch_operations_complete",
      value: totalDuration,
      unit: "milliseconds",
      category: "batch",
      metadata: {
        totalOperations: operations.length,
        totalBatches,
        averagePerBatch: totalDuration / totalBatches,
        throughput: operations.length / (totalDuration / 1000),
      },
    });

    return results;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Record performance metric with enhanced metadata
   */
  private recordMetric(metric: {
    name: string;
    value: number;
    unit: string;
    category: "timing" | "memory" | "cache" | "batch";
    metadata?: any;
  }): void {
    const performanceMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString(),
    };

    this.performanceLog.push(performanceMetric);

    // Maintain log size
    if (this.performanceLog.length > this.maxLogSize) {
      this.performanceLog = this.performanceLog.slice(-this.maxLogSize);
    }

    // Send to performance monitoring if available
    this.sendToPerformanceMonitoring(performanceMetric);
  }

  /**
   * Send metrics to performance monitoring system
   */
  private sendToPerformanceMonitoring(metric: PerformanceMetric): void {
    try {
      // In a real implementation, this would send to your monitoring service
      // For now, we'll use the browser's performance API if available
      if (typeof window !== "undefined" && window.performance) {
        const perfEntry = {
          name: metric.name,
          entryType: "measure" as const,
          startTime: Date.now(),
          duration: metric.value,
          detail: metric,
        };
        window.performance.mark(metric.name);
      }
    } catch (error) {
      // Silently fail to avoid cascading issues
    }
  }

  /**
   * Get performance analytics
   */
  getAnalytics(): {
    totalMetrics: number;
    cacheHitRate: number;
    averageOperationTime: number;
    slowOperations: number;
    memoryOptimizations: number;
    recentMetrics: PerformanceMetric[];
  } {
    const cacheMetrics = this.performanceLog.filter(
      (m) => m.category === "cache"
    );
    const timingMetrics = this.performanceLog.filter(
      (m) => m.category === "timing"
    );
    const slowOperations = this.performanceLog.filter(
      (m) => m.name === "slow_operation"
    );
    const memoryOptimizations = this.performanceLog.filter(
      (m) => m.name === "memory_optimization"
    );

    const cacheHits = cacheMetrics.filter((m) => m.name === "cache_hit").length;
    const cacheTotal =
      cacheHits + cacheMetrics.filter((m) => m.name === "cache_miss").length;
    const cacheHitRate = cacheTotal > 0 ? (cacheHits / cacheTotal) * 100 : 0;

    const totalTiming = timingMetrics.reduce((sum, m) => sum + m.value, 0);
    const averageOperationTime =
      timingMetrics.length > 0 ? totalTiming / timingMetrics.length : 0;

    return {
      totalMetrics: this.performanceLog.length,
      cacheHitRate: Math.round(cacheHitRate),
      averageOperationTime: Math.round(averageOperationTime),
      slowOperations: slowOperations.length,
      memoryOptimizations: memoryOptimizations.length,
      recentMetrics: this.performanceLog.slice(-10),
    };
  }
}

// Web Vitals monitoring
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor;

  static getInstance(): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor();
    }
    return WebVitalsMonitor.instance;
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeVitals();
    }
  }

  private initializeVitals(): void {
    // Monitor Core Web Vitals
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
  }

  private observeCLS(): void {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === "layout-shift" &&
            !(entry as any).hadRecentInput
          ) {
            console.log("CLS:", (entry as any).value);
          }
        }
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    }
  }

  private observeFID(): void {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            console.log(
              "FID:",
              (entry as any).processingStart - (entry as any).startTime
            );
          }
        }
      });
      observer.observe({ entryTypes: ["first-input"] });
    }
  }

  private observeLCP(): void {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", (lastEntry as any).startTime);
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    }
  }
}

// React lazy loading optimization
export const createOptimizedComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFn);

  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  ));
};

// Resource preloading
export class ResourcePreloader {
  private static instance: ResourcePreloader;

  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  preloadAudio(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadeddata = () => resolve();
      audio.onerror = reject;
      audio.src = src;
    });
  }

  async preloadCriticalResources(
    resources: Array<{ src: string; type: "image" | "audio" }>
  ): Promise<void> {
    const promises = resources.map((resource) => {
      if (resource.type === "image") {
        return this.preloadImage(resource.src);
      } else {
        return this.preloadAudio(resource.src);
      }
    });

    await Promise.allSettled(promises);
  }
}

// Connection-aware loading
export class ConnectionAwareLoader {
  static getEffectiveType(): string {
    // @ts-ignore
    return navigator.connection?.effectiveType || "4g";
  }

  static shouldLoadHighQuality(): boolean {
    const effectiveType = this.getEffectiveType();
    return effectiveType === "4g" || effectiveType === "wifi";
  }

  static adaptQualitySettings(): {
    imageQuality: number;
    videoQuality: string;
  } {
    const effectiveType = this.getEffectiveType();

    switch (effectiveType) {
      case "slow-2g":
      case "2g":
        return { imageQuality: 0.5, videoQuality: "low" };
      case "3g":
        return { imageQuality: 0.7, videoQuality: "medium" };
      case "4g":
      case "wifi":
      default:
        return { imageQuality: 1.0, videoQuality: "high" };
    }
  }
}

// Memory monitoring
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryWarnings: number = 0;

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  getMemoryUsage(): any {
    if ("memory" in performance) {
      // @ts-ignore
      return performance.memory;
    }
    return null;
  }

  shouldWarnAboutMemory(): boolean {
    const memory = this.getMemoryUsage();
    if (!memory) return false;

    const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

    if (usedRatio > 0.9) {
      this.memoryWarnings++;
      if (this.memoryWarnings === 1) {
        console.warn(
          "Memory usage critical:",
          Math.round(usedRatio * 100) + "%"
        );
      }
      return true;
    }

    return false;
  }

  getMemoryOptimizedSettings(): { maxCacheSize: number; batchSize: number } {
    const memory = this.getMemoryUsage();
    if (!memory) {
      return { maxCacheSize: 100, batchSize: 5 };
    }

    const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

    if (usedRatio > 0.8) {
      return { maxCacheSize: 50, batchSize: 3 };
    } else if (usedRatio > 0.6) {
      return { maxCacheSize: 75, batchSize: 4 };
    }

    return { maxCacheSize: 100, batchSize: 5 };
  }
}

export default {
  PerformanceOptimizer: PerformanceOptimizer.getInstance(),
  WebVitalsMonitor: WebVitalsMonitor.getInstance(),
  ResourcePreloader: ResourcePreloader.getInstance(),
  ConnectionAwareLoader,
  MemoryMonitor: MemoryMonitor.getInstance(),
};
