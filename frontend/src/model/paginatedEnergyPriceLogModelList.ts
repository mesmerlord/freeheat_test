/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * freeheat_test API
 * Documentation of API endpoints of freeheat_test
 * OpenAPI spec version: 1.0.0
 */
import type { EnergyPriceLogModel } from './energyPriceLogModel';

export interface PaginatedEnergyPriceLogModelList {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: EnergyPriceLogModel[];
}
