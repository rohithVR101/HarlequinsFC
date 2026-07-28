export interface Fixture {
  id: string;
  competition: 'Premier League' | 'FA Cup' | 'Carabao Cup';
  date: string; // e.g. "Sat 14 Sep 2026"
  time: string; // e.g. "15:00"
  isoDate: string; // YYYY-MM-DD for sorting/filtering
  month: string; // e.g. "September 2026"
  homeTeam: {
    name: string;
    shortName: string;
    logo?: string;
    isHarlequins: boolean;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo?: string;
    isHarlequins: boolean;
  };
  venue: string;
  status: 'COMPLETED' | 'UPCOMING';
  homeScore?: number;
  awayScore?: number;
  matchReportUrl?: string;
  ticketUrl?: string;
  roundNote?: string;
}

export const fixturesData: Fixture[] = [
  // --- AUGUST 2026 ---
  {
    id: 'fix-1',
    competition: 'Premier League',
    date: 'Sat 15 Aug 2026',
    time: '12:30',
    isoDate: '2026-08-15',
    month: 'August 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Liverpool', shortName: 'LIV', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'COMPLETED',
    homeScore: 2,
    awayScore: 2,
  },
  {
    id: 'fix-2',
    competition: 'Premier League',
    date: 'Sat 22 Aug 2026',
    time: '15:00',
    isoDate: '2026-08-22',
    month: 'August 2026',
    homeTeam: { name: 'Manchester City', shortName: 'MCI', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'Etihad Stadium, Manchester',
    status: 'COMPLETED',
    homeScore: 4,
    awayScore: 1,
  },
  {
    id: 'fix-carabao-r2',
    competition: 'Carabao Cup',
    date: 'Tue 25 Aug 2026',
    time: '19:45',
    isoDate: '2026-08-25',
    month: 'August 2026',
    homeTeam: { name: 'Hampton & Richmond', shortName: 'HRB', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'Beveree Stadium, Hampton (Grassroots Derby)',
    status: 'COMPLETED',
    homeScore: 0,
    awayScore: 4,
    roundNote: 'Carabao Cup Round 2',
  },
  {
    id: 'fix-3',
    competition: 'Premier League',
    date: 'Sat 29 Aug 2026',
    time: '17:30',
    isoDate: '2026-08-29',
    month: 'August 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Fulham', shortName: 'FUL', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'COMPLETED',
    homeScore: 3,
    awayScore: 1,
  },

  // --- SEPTEMBER 2026 ---
  {
    id: 'fix-4',
    competition: 'Premier League',
    date: 'Sat 12 Sep 2026',
    time: '15:00',
    isoDate: '2026-09-12',
    month: 'September 2026',
    homeTeam: { name: 'Brighton & Hove Albion', shortName: 'BHA', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'American Express Stadium, Brighton',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-5',
    competition: 'Premier League',
    date: 'Sat 19 Sep 2026',
    time: '15:00',
    isoDate: '2026-09-19',
    month: 'September 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Southampton', shortName: 'SOU', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-carabao-r3',
    competition: 'Carabao Cup',
    date: 'Tue 22 Sep 2026',
    time: '19:45',
    isoDate: '2026-09-22',
    month: 'September 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Kingstonian FC', shortName: 'KNG', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham (Cross-River Derby)',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
    roundNote: 'Carabao Cup Round 3',
  },
  {
    id: 'fix-7',
    competition: 'Premier League',
    date: 'Sat 26 Sep 2026',
    time: '17:30',
    isoDate: '2026-09-26',
    month: 'September 2026',
    homeTeam: { name: 'Aston Villa', shortName: 'AVL', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'Villa Park, Birmingham',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },

  // --- OCTOBER 2026 ---
  {
    id: 'fix-8',
    competition: 'Premier League',
    date: 'Sat 03 Oct 2026',
    time: '15:00',
    isoDate: '2026-10-03',
    month: 'October 2026',
    homeTeam: { name: 'West Ham United', shortName: 'WHU', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'London Stadium, London',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-9',
    competition: 'Premier League',
    date: 'Sat 17 Oct 2026',
    time: '15:00',
    isoDate: '2026-10-17',
    month: 'October 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Everton', shortName: 'EVE', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-10',
    competition: 'Premier League',
    date: 'Sat 24 Oct 2026',
    time: '17:30',
    isoDate: '2026-10-24',
    month: 'October 2026',
    homeTeam: { name: 'Brentford', shortName: 'BRE', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'Gtech Community Stadium, Brentford',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-carabao-r4',
    competition: 'Carabao Cup',
    date: 'Wed 28 Oct 2026',
    time: '19:45',
    isoDate: '2026-10-28',
    month: 'October 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Brentford', shortName: 'BRE', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham (Borough Derby)',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
    roundNote: 'Carabao Cup Round 4 (Round of 16)',
  },

  // --- NOVEMBER 2026 ---
  {
    id: 'fix-11',
    competition: 'Premier League',
    date: 'Sat 31 Oct 2026',
    time: '15:00',
    isoDate: '2026-10-31',
    month: 'November 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Leicester City', shortName: 'LEI', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-12',
    competition: 'Premier League',
    date: 'Sat 07 Nov 2026',
    time: '16:30',
    isoDate: '2026-11-07',
    month: 'November 2026',
    homeTeam: { name: 'Tottenham Hotspur', shortName: 'TOT', isHarlequins: false },
    awayTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    venue: 'Tottenham Hotspur Stadium, London',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },
  {
    id: 'fix-13',
    competition: 'Premier League',
    date: 'Sat 21 Nov 2026',
    time: '20:00',
    isoDate: '2026-11-21',
    month: 'November 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Manchester United', shortName: 'MUN', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
  },

  // --- DECEMBER 2026 ---
  {
    id: 'fix-carabao-qf',
    competition: 'Carabao Cup',
    date: 'Tue 15 Dec 2026',
    time: '19:45',
    isoDate: '2026-12-15',
    month: 'December 2026',
    homeTeam: { name: 'Harlequins FC', shortName: 'HAR', isHarlequins: true },
    awayTeam: { name: 'Chelsea', shortName: 'CHE', isHarlequins: false },
    venue: 'Craneford Way Stadium, Twickenham (West London Derby)',
    status: 'UPCOMING',
    ticketUrl: '/tickets',
    roundNote: 'Carabao Cup Quarter-Final',
  },
];
