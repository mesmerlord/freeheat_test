/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * freeheat_test API
 * Documentation of API endpoints of freeheat_test
 * OpenAPI spec version: 1.0.0
 */

/**
 * User model w/o password
 */
export interface PatchedUserDetails {
  readonly pk?: number;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username?: string;
  readonly email?: string;
  readonly first_name?: string;
  readonly last_name?: string;
}
