/**
 * Enterprise Kanban CRM Domain Types
 * Strictly typed definitions for pipeline stages, leads, audit logging, and filtering.
 */

/**
 * Pipeline stages representing the full deal progression lifecycle.
 */
export type StageId = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

/**
 * Core Lead entity containing sales deal details, contact info, and ownership.
 */
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  dealValue: number;
  stage: StageId;
  assignedOwner: string;
  avatarUrl?: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Action classifications for the CRM audit trail.
 */
export type ActivityAction = 'CREATED' | 'STAGE_CHANGED' | 'UPDATED' | 'DELETED';

/**
 * Audit log entry capturing all critical sales operations and state mutations.
 */
export interface ActivityLog {
  id: string;
  leadId: string;
  leadName: string;
  action: ActivityAction;
  description: string;
  timestamp: string; // ISO 8601 string
  author: string;
}

/**
 * Pipeline filtering parameters for multi-field search and ownership views.
 */
export interface CRMFilterState {
  searchQuery: string;
  selectedOwner: string;
  selectedStage: string;
}

/**
 * Stage configuration metadata for visual chips, gradients, and header metrics.
 */
export interface StageConfig {
  id: StageId;
  label: string;
  color: string;
  accentBg: string;
  badgeClass: string;
}

/**
 * Real-time computed pipeline performance metrics.
 */
export interface PipelineMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  wonDeals: number;
  totalPipelineValue: number;
}
