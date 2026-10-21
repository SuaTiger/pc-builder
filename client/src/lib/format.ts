const baht = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export const formatBaht = (amount: number) => baht.format(amount);

export const formatWatts = (watts: number) => `${watts} W`;

/** 500 -> "500 GB", 2000 -> "2 TB". */
export function formatCapacity(gigabytes: number): string {
  return gigabytes >= 1000 ? `${gigabytes / 1000} TB` : `${gigabytes} GB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
