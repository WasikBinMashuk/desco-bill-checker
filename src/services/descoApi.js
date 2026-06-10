const METER_NO = '661120018636';
const API_URL = `https://prepaid.desco.org.bd/api/tkdes/customer/getBalance?accountNo=&meterNo=${METER_NO}`;

export async function fetchBalance() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle various response envelope shapes from the DESCO API
    const payload = data?.data ?? data?.result ?? data?.response ?? data;

    const balance = extractBalance(payload);
    if (balance === null) {
      throw new Error('Balance data not found in API response.');
    }

    return {
      balance,
      meterNo: METER_NO,
      accountNo: payload?.accountNo ?? payload?.account_no ?? payload?.customerNo ?? '',
      customerName: payload?.customerName ?? payload?.customer_name ?? payload?.name ?? '',
      currentMonthConsumption: parseFloat(payload?.currentMonthConsumption ?? payload?.current_month_consumption ?? 0),
      unit: payload?.unit ?? payload?.energyUnit ?? 'BDT',
      readingTime: parseReadingTime(payload?.readingTime ?? payload?.reading_time),
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw err;
  }
}

function parseReadingTime(value) {
  if (!value) return null;

  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T');
  const parsed = new Date(normalized);

  return isNaN(parsed.getTime()) ? null : parsed;
}

function extractBalance(payload) {
  if (payload == null) return null;

  // Try common field names used by the DESCO API
  const candidates = [
    payload.balance,
    payload.Balance,
    payload.currentBalance,
    payload.current_balance,
    payload.availableBalance,
    payload.available_balance,
    payload.amount,
    payload.Amount,
  ];

  for (const v of candidates) {
    const n = parseFloat(v);
    if (!isNaN(n)) return n;
  }

  return null;
}
