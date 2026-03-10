export type User = {
  id: string;
  name: string;
  role: 'Operations Manager' | 'Technician';
  avatar: string;
  accessKey: string;
  status: 'On-Duty' | 'Off-Duty' | 'On-Call';
};

export type Asset = {
  id: string;
  name: string;
  type: 'Elevator' | 'Escalator';
  location: string;
  status: 'Operational' | 'Warning' | 'Fault';
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  uptime: number;
};

export type Incident = {
  id: string;
  title: string;
  assetId: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Unresolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reportedBy: string;
  reportedAt: string;
  description: string;
  resolutionNotes?: string;
  resolvedAt?: string;
};

export type Maintenance = {
  id: string;
  assetId: string;
  scheduledDate: string;
  type: 'Routine Check' | 'Repair' | 'Upgrade';
  status: 'Scheduled' | 'In Progress' | 'Completed';
};
