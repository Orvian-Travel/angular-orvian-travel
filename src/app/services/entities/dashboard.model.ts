export interface Dashboard {
  newUsers: number | null;
  newPackages: number | null;
  weekRating: WeekRating;
  salesByPackage: SumTotalByPackage[];
}

export interface SumTotalByPackage {
  destination: string;
  name: string;
  reservationYear: number;
  reservationWeek: number;
  confirmedReservationsCount: number;
  approvedPaymentsSum: number;
}

export interface WeekRating {
  currentRating: number | null,
  beforeRating: number | null,
  percentage: number | null
}

