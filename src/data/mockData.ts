import { Lead, ActivityLog, StageConfig } from '../types/crm';

/**
 * Visual metadata and display attributes for pipeline stages matching Figma design.
 */
export const PIPELINE_STAGES: StageConfig[] = [
  {
    id: 'NEW',
    label: 'New Leads',
    color: '#0284C7', // Sky
    accentBg: 'rgba(2, 132, 199, 0.15)',
    badgeClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  },
  {
    id: 'CONTACTED',
    label: 'Contacted',
    color: '#D97706', // Amber
    accentBg: 'rgba(217, 119, 6, 0.15)',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'QUALIFIED',
    label: 'Qualified',
    color: '#7C3AED', // Violet
    accentBg: 'rgba(124, 58, 237, 0.15)',
    badgeClass: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  },
  {
    id: 'WON',
    label: 'Closed Won',
    color: '#059669', // Emerald
    accentBg: 'rgba(5, 150, 105, 0.15)',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'LOST',
    label: 'Closed Lost',
    color: '#E11D48', // Rose
    accentBg: 'rgba(225, 29, 72, 0.15)',
    badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
];

/**
 * Initial enterprise leads seed dataset distributed across all 5 stages.
 * Values range from $10,000 to $185,000 with designated owners: Sangili, Matina, Siela, Alex.
 */
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@novasphere.io',
    company: 'NovaSphere Cloud Solutions',
    dealValue: 125000,
    stage: 'NEW',
    assignedOwner: 'Sangili',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Marcus Vance',
    email: 'm.vance@apexfintech.com',
    company: 'Apex Financial Technologies',
    dealValue: 78000,
    stage: 'NEW',
    assignedOwner: 'Matina',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'lead-3',
    name: 'Elena Rostova',
    email: 'elena@cyberguard.security',
    company: 'CyberGuard Systems',
    dealValue: 185000,
    stage: 'CONTACTED',
    assignedOwner: 'Sangili',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-4',
    name: 'Devon Miles',
    email: 'devon@omnilogistics.global',
    company: 'OmniLogistics Global',
    dealValue: 42000,
    stage: 'CONTACTED',
    assignedOwner: 'Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'lead-5',
    name: 'Aisha Al-Mansoor',
    email: 'aisha@solarexenergy.ae',
    company: 'SolarEx Energy Holdings',
    dealValue: 145000,
    stage: 'QUALIFIED',
    assignedOwner: 'Siela',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'lead-6',
    name: 'Liam Gallagher',
    email: 'liam@hyperflowdata.co',
    company: 'HyperFlow Streaming',
    dealValue: 92000,
    stage: 'QUALIFIED',
    assignedOwner: 'Matina',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'lead-7',
    name: 'Priya Patel',
    email: 'priya.patel@quantumbiotech.org',
    company: 'Quantum BioLabs',
    dealValue: 110000,
    stage: 'QUALIFIED',
    assignedOwner: 'Sangili',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(),
  },
  {
    id: 'lead-8',
    name: 'Ethan Hunt',
    email: 'e.hunt@missioncritical.net',
    company: 'Mission Critical Infra',
    dealValue: 165000,
    stage: 'WON',
    assignedOwner: 'Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'lead-9',
    name: 'Sofia Vergara-Silva',
    email: 'sofia@luminahealth.com',
    company: 'Lumina Health Enterprise',
    dealValue: 98000,
    stage: 'WON',
    assignedOwner: 'Siela',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'lead-10',
    name: 'Kenji Takahashi',
    email: 'kenji@robocore.jp',
    company: 'RoboCore Automations',
    dealValue: 24000,
    stage: 'LOST',
    assignedOwner: 'Matina',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'lead-11',
    name: 'Camila Morales',
    email: 'camila@vanguardmedia.co',
    company: 'Vanguard Digital Media',
    dealValue: 15000,
    stage: 'LOST',
    assignedOwner: 'Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
  },
];

/**
 * Initial audit logs demonstrating realistic sales lifecycle actions and transitions.
 */
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    leadId: 'lead-8',
    leadName: 'Ethan Hunt',
    action: 'STAGE_CHANGED',
    description: 'Moved deal from QUALIFIED to WON ($165,000 signed enterprise contract)',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
    author: 'Alex',
  },
  {
    id: 'act-2',
    leadId: 'lead-3',
    leadName: 'Elena Rostova',
    action: 'STAGE_CHANGED',
    description: 'Moved from NEW to CONTACTED after initial discovery briefing',
    timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(), // ~2.2 hrs ago
    author: 'Sangili',
  },
  {
    id: 'act-3',
    leadId: 'lead-5',
    leadName: 'Aisha Al-Mansoor',
    action: 'STAGE_CHANGED',
    description: 'Promoted from CONTACTED to QUALIFIED after technical security audit approval',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(), // ~5 hrs ago
    author: 'Siela',
  },
  {
    id: 'act-4',
    leadId: 'lead-1',
    leadName: 'Sarah Jenkins',
    action: 'CREATED',
    description: 'Inbound enterprise inquiry received and logged into pipeline',
    timestamp: new Date(Date.now() - 1000 * 60 * 750).toISOString(), // ~12 hrs ago
    author: 'Sangili',
  },
  {
    id: 'act-5',
    leadId: 'lead-9',
    leadName: 'Sofia Vergara-Silva',
    action: 'STAGE_CHANGED',
    description: 'Contract counter-signed. Moved to WON by Siela',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440 * 1.5).toISOString(), // 1.5 days ago
    author: 'Siela',
  },
  {
    id: 'act-6',
    leadId: 'lead-10',
    leadName: 'Kenji Takahashi',
    action: 'STAGE_CHANGED',
    description: 'Marked as LOST due to competitor exclusivity clause',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440 * 2.8).toISOString(), // 2.8 days ago
    author: 'Matina',
  },
];
