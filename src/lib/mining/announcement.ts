export interface MinerAnnouncement {
  enabled: boolean;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const MINER_ANNOUNCEMENT: MinerAnnouncement = {
  enabled: true,
  title: ' Mining Pool Update',
  message: 'New merged mining pools now available for SHA-256 and Scrypt ASICs. Check our mining guide for setup instructions.',
  type: 'info',
};
