const express = require('express');
const rentGuyService = require('../services/rentGuyService');
const sevensaService = require('../services/sevensaService');

const router = express.Router();

const CRM_EXPORT_COLUMNS = [
  'lead_id',
  'queue_status',
  'queued_at',
  'attempts',
  'last_error',
  'firstname',
  'lastname',
  'email',
  'phone',
  'company',
  'message',
  'event_date',
  'event_type',
  'budget',
  'page_uri',
  'page_name',
  'source'
];

function toCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  if (/["\n,]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function buildCsv(columns, rows) {
  const header = columns.join(',');
  const body = rows.map((row) => columns.map((column) => toCsvValue(row[column])).join(','));
  return [header].concat(body).join('\n');
}

router.get('/rentguy/status', async (_req, res, next) => {
  try {
    const status = await rentGuyService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.get('/sevensa/status', async (_req, res, next) => {
  try {
    const status = await sevensaService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

router.get('/crm/export', async (_req, res, next) => {
  try {
    const rows = await sevensaService.getCrmExportRows();
    const csv = buildCsv(CRM_EXPORT_COLUMNS, rows);
    res.set('Content-Type', 'text/csv; charset=utf-8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.set('Content-Disposition', `attachment; filename="crm-export-${timestamp}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
