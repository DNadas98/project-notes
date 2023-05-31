const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

function logRequest(req, res, next) {
  const message = `${req.method}\t${req.originalUrl}\t${req.ip}`;
  const logName = 'reqLog.txt';
  logEvents(message, logName);
  next();
}

function logServed(req, res) {
  const message = `${req.method}\t${req.url}\t${res.statusCode}`;
  const logName = 'servedLog.txt';
  logEvents(message, logName);
}
function logError(err, req) {
  const reqString = req ? `\t${req.method}\t${req.originalUrl}\t${req.url}\t${req.ip}` : '';
  const message = `Error: ${err.message}${reqString}`;
  const logName = 'errLog.txt';
  logEvents(message, logName);
}

async function logEvents(message, logName) {
  const dateTime = `${format(new Date(), 'yyyyMMdd HH:mm:ss')}`;
  const logItem = `${dateTime}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, '../', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '../', 'logs'));
    }
    await fsPromises.appendFile(path.join(__dirname, '../', 'logs', logName), logItem);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { logRequest, logServed, logError };
