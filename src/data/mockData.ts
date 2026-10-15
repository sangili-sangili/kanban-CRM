import { Lead, ActivityLog, StageConfig } from '../types/crm';

/**
 * Visual metadata and display attributes for pipeline stages matching Figma design.
 */
export const PIPELINE_STAGES: StageConfig[] = [
  {
    id: 'NEW',
    label: 'New',
    badgeLabel: 'New',
    color: '#0284C7', // Sky
    headerBorderColor: 'border-sky-500',
    pillBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    pillText: 'text-sky-400',
  },
  {
    id: 'CONTACTED',
    label: 'Contacted',
    badgeLabel: 'Stage',
    color: '#D97706', // Amber
    headerBorderColor: 'border-amber-500',
    pillBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    pillText: 'text-amber-400',
  },
  {
    id: 'QUALIFIED',
    label: 'Qualified',
    badgeLabel: 'Stage',
    color: '#7C3AED', // Violet
    headerBorderColor: 'border-violet-500',
    pillBg: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    pillText: 'text-violet-400',
  },
  {
    id: 'WON',
    label: 'Won',
    badgeLabel: 'Won',
    color: '#059669', // Emerald
    headerBorderColor: 'border-emerald-500',
    pillBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    pillText: 'text-emerald-400',
  },
  {
    id: 'LOST',
    label: 'Lost',
    badgeLabel: 'Lost',
    color: '#E11D48', // Rose
    headerBorderColor: 'border-rose-500',
    pillBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    pillText: 'text-rose-400',
  },
];

/**
 * Leads matching the Figma design cards with badges, tags, and amounts.
 */
export const INITIAL_LEADS: Lead[] = [
  // New Stage
  {
    id: 'lead-1',
    name: 'Sangili',
    title: 'Face Badge',
    company: 'NovaSphere Cloud Solutions',
    email: 'sangili@novasphere.io',
    dealValue: 125000,
    stage: 'NEW',
    assignedOwner: 'Sangili',
    tags: ['New', 'Contacted', 'Qualified'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Manina',
    title: 'Face Badge',
    company: 'Apex Technologies',
    email: 'manina@apextech.com',
    dealValue: 28000,
    stage: 'NEW',
    assignedOwner: 'Matina',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['Qualified', 'Qualified'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'lead-3',
    name: 'Samar',
    title: 'Face Badge',
    company: 'CyberGuard Systems',
    email: 'samar@cyberguard.security',
    dealValue: 15500,
    stage: 'NEW',
    assignedOwner: 'Alex',
    tags: ['Qualified', 'Lost'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },

  // Contacted Stage
  {
    id: 'lead-4',
    name: 'Litlry',
    title: 'Face Badge',
    company: 'OmniLogistics Global',
    email: 'litlry@omnilogistics.global',
    dealValue: 28000,
    stage: 'CONTACTED',
    assignedOwner: 'Sangili',
    tags: ['Contacted', 'Qualified', 'Customzarics'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-5',
    name: 'Acsan',
    title: 'Face Badge',
    company: 'SolarEx Energy',
    email: 'acsan@solarex.ae',
    dealValue: 15000,
    stage: 'CONTACTED',
    assignedOwner: 'Alex',
    tags: ['Qualified', 'Won', 'Lost'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
  },

  // Qualified Stage
  {
    id: 'lead-6',
    name: 'Masthel',
    title: 'Face Badge',
    company: 'HyperFlow Streaming',
    email: 'masthel@hyperflow.co',
    dealValue: 165000,
    stage: 'QUALIFIED',
    assignedOwner: 'Siela',
    tags: ['New', 'Qualified', 'Qualified'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-7',
    name: 'Siela',
    title: 'Face Badge',
    company: 'Quantum BioLabs',
    email: 'siela@quantumbiotech.org',
    dealValue: 184300,
    stage: 'QUALIFIED',
    assignedOwner: 'Siela',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tags: ['New', 'Contact', 'Qualified'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
  },

  // Won Stage
  {
    id: 'lead-8',
    name: 'Matina',
    title: 'Face Badge',
    company: 'Mission Critical Infra',
    email: 'matina@missioncritical.net',
    dealValue: 184300,
    stage: 'WON',
    assignedOwner: 'Matina',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tags: ['Won', 'Contacted', 'Deskrocks'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
  },

  // Lost Stage
  {
    id: 'lead-9',
    name: 'Weston',
    title: 'Face Badge',
    company: 'RoboCore Automations',
    email: 'weston@robocore.jp',
    dealValue: 12000,
    stage: 'LOST',
    assignedOwner: 'Alex',
    tags: ['Lost', 'Closed'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
  },
];

/**
 * Activity log timeline items matching Figma's right-hand activity history panel.
 */
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    leadId: 'lead-7',
    leadName: 'Siela',
    action: 'STAGE_CHANGED',
    description: 'Loadings the enterprise contract pipeline review',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    author: 'Alex',
    badgeColor: 'blue',
  },
  {
    id: 'act-2',
    leadId: 'lead-6',
    leadName: 'Masthel',
    action: 'UPDATED',
    description: "Writer's action briefing completed with stakeholders",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    author: 'Sangili',
    badgeColor: 'orange',
  },
  {
    id: 'act-3',
    leadId: 'lead-8',
    leadName: 'Matina',
    action: 'CREATED',
    description: 'Activity motion triggered for inbound expansion deal',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    author: 'Siela',
    badgeColor: 'teal',
  },
  {
    id: 'act-4',
    leadId: 'lead-8',
    leadName: 'Matina',
    action: 'STAGE_CHANGED',
    description: 'Action-based onboarding signed ($184,300)',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    author: 'Matina',
    badgeColor: 'emerald',
  },
  {
    id: 'act-5',
    leadId: 'lead-4',
    leadName: 'Litlry',
    action: 'STAGE_CHANGED',
    description: 'Action seed or team escalation briefing',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    author: 'Sangili',
    badgeColor: 'pink',
  },
  {
    id: 'act-6',
    leadId: 'lead-1',
    leadName: 'Sangili',
    action: 'UPDATED',
    description: 'Micro-copy with action booters attached to lead',
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7 hours ago
    author: 'Siela',
    badgeColor: 'violet',
  },
  {
    id: 'act-7',
    leadId: 'lead-2',
    leadName: 'Manina',
    action: 'STAGE_CHANGED',
    description: 'Micro-copy workflow executed for pipeline review',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    author: 'Matina',
    badgeColor: 'rose',
  },
];
