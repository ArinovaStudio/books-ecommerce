export function parseDate(input?: string | number | null): Date | null {
  if (!input) return null;

  // Excel serial date (number)
  if (typeof input === "number" || /^\d+$/.test(input)) {
    const excelEpoch = new Date(1899, 11, 30);
    const days = Number(input);
    if (!isNaN(days)) {
      return new Date(excelEpoch.getTime() + days * 86400000);
    }
  }

  const value = String(input).trim();
  if (!value) return null;

  // ISO or native Date parsable formats
  const native = new Date(value);
  if (!isNaN(native.getTime())) {
    return native;
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const dmy = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy.map(Number);
    return new Date(y, m - 1, d);
  }

  // YYYY-MM-DD or YYYY/MM/DD
  const ymd = value.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymd) {
    const [, y, m, d] = ymd.map(Number);
    return new Date(y, m - 1, d);
  }

  // DD Mon YYYY (15 Jan 2002)
  const textMonth = Date.parse(value);
  if (!isNaN(textMonth)) {
    return new Date(textMonth);
  }

  return null;
}
