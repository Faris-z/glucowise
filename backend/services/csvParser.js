const { parse } = require('csv-parse/sync');

// LibreLink column mappings
const LIBRE_COLS = {
  timestamp: 'Device Timestamp',
  historic: 'Historic Glucose mg/dL',
  scan: 'Scan Glucose mg/dL',
  recordType: 'Record Type',
};

// Dexcom column mappings
const DEXCOM_COLS = {
  timestamp: 'Timestamp (YYYY-MM-DDThh:mm:ss)',
  value: 'Glucose Value (mg/dL)',
};

/**
 * Detect CSV format and return normalized readings array
 * @returns {Array<{timestamp: Date, glucose: number, type: string}>}
 */
function parseCSV(buffer) {
  const content = buffer.toString('utf8');

  // Strip BOM and skip leading non-header rows (LibreLink has 2 header rows)
  const lines = content.replace(/^\uFEFF/, '').split('\n');
  const headerIndex = lines.findIndex(l =>
    l.includes('Timestamp') || l.includes('Device Timestamp')
  );
  const csvContent = lines.slice(headerIndex).join('\n');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (!records.length) throw new Error('Empty CSV file');

  const cols = Object.keys(records[0]);

  // Detect format
  if (cols.includes(LIBRE_COLS.timestamp)) return parseLibre(records);
  if (cols.includes(DEXCOM_COLS.timestamp)) return parseDexcom(records);
  return parseGeneric(records, cols); // best-effort
}

function parseLibre(records) {
  return records
    .filter(r => r[LIBRE_COLS.recordType] === '0' || r[LIBRE_COLS.recordType] === '1')
    .map(r => {
      const glucose =
        parseFloat(r[LIBRE_COLS.historic]) || parseFloat(r[LIBRE_COLS.scan]);
      return {
        timestamp: new Date(r[LIBRE_COLS.timestamp]),
        glucose,
        type: r[LIBRE_COLS.recordType] === '0' ? 'historic' : 'scan',
      };
    })
    .filter(r => !isNaN(r.glucose) && r.timestamp instanceof Date && !isNaN(r.timestamp));
}

function parseDexcom(records) {
  return records
    .map(r => ({
      timestamp: new Date(r[DEXCOM_COLS.timestamp]),
      glucose: parseFloat(r[DEXCOM_COLS.value]),
      type: 'historic',
    }))
    .filter(r => !isNaN(r.glucose) && !isNaN(r.timestamp));
}

function parseGeneric(records, cols) {
  // Find timestamp-like and glucose-like columns heuristically
  const tsCol = cols.find(c => /time|date/i.test(c));
  const glCol = cols.find(c => /glucose|sugar|bg|mmol|mg/i.test(c));
  if (!tsCol || !glCol) throw new Error('Cannot detect glucose/timestamp columns');

  return records
    .map(r => ({
      timestamp: new Date(r[tsCol]),
      glucose: parseFloat(r[glCol]),
      type: 'historic',
    }))
    .filter(r => !isNaN(r.glucose) && !isNaN(r.timestamp));
}

module.exports = { parseCSV };
