/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * freeheat_test API
 * Documentation of API endpoints of freeheat_test
 * OpenAPI spec version: 1.0.0
 */
import type { UserCarChargeLogModel } from './userCarChargeLogModel';

export interface UserCarDetailModel {
  readonly id: number;
  readonly user_car_charge_logs: UserCarChargeLogModel[];
  readonly created_at: string;
  readonly updated_at: string;
  name: string;
  model: string;
  year: number;
  max_energy: string;
  current_energy: string;
  is_charging?: boolean;
  is_active?: boolean;
  owner: number;
}