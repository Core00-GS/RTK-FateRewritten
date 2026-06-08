/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Robust Save Data Migration Utility
 * Safely evaluates old archive entries and upgrades them to the current V2 standard.
 */
export function migrateSaveData(raw: any, initialRegions?: any[]): { migrated: any; wasMigrated: boolean } {
  if (!raw) return { migrated: null, wasMigrated: false };

  let data = { ...raw };
  let wasMigrated = false;

  // Case 1: Raw contains an outer exported wrapper (exported style)
  if (raw.saveData) {
    data = { ...raw.saveData };
    wasMigrated = true;
  }

  // Normalize Save Architecture Version to Modern V2
  if (!data.version || data.version !== '2.0') {
    data.version = '2.0';
    wasMigrated = true;
  }

  // Ensure region annotations structure exists
  if (!data.annotations) {
    data.annotations = {};
    wasMigrated = true;
  }

  // Ensure achievements structure exists
  if (!data.unlockedAchievements) {
    data.unlockedAchievements = [];
    wasMigrated = true;
  }

  // Ensure history tracking list exists
  if (!data.historyRecords) {
    data.historyRecords = [];
    wasMigrated = true;
  }

  // Safety net: Normalize Regions array structure
  if (data.regions) {
    if (!Array.isArray(data.regions) && typeof data.regions === 'object') {
      // If of format { regionId: factionId }, try reconstruction with initial regions fallback
      if (initialRegions) {
        const reconstructed = initialRegions.map((r: any) => {
          const faction = data.regions[r.id] || r.faction;
          return { ...r, faction };
        });
        data.regions = reconstructed;
        wasMigrated = true;
      }
    }
  }

  // Normalize stats defaults
  if (data.stats) {
    if (data.stats.deviance === undefined) {
      data.stats.deviance = 0;
      wasMigrated = true;
    }
    if (data.stats.autoDevelopmentGold === undefined) {
      data.stats.autoDevelopmentGold = 0;
    }
    if (data.stats.autoDevelopmentPassiveIncome === undefined) {
      data.stats.autoDevelopmentPassiveIncome = 0;
    }
  }

  return { migrated: data, wasMigrated };
}
