import fetch from 'node-fetch';
import csv from 'csv-parser';
import fs from 'fs';
import readline from 'readline';

const API_KEY = '4fa6f7639b5ba104d98ab30b74b677b4e74d6aa8fdabd255af7065b7f772d1b8146ae2720fa099a5';
const url = 'https://api.abuseipdb.com/api/v2/check';

const csv_columns = [
  'ipAddress',
  'isPublic',
  'ipVersion',
  'isWhitelisted',
  'abuseConfidenceScore',
  'countryCode',
  'usageType',
  'isp',
  'domain',
  'hostnames',
  'totalReports',
  'numDistinctUsers',
  'lastReportedAt'
];

const results = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
console.log("\n")
console.log(`#################################################################
██╗██████╗ ██╗  ██╗████████╗ ██████╗  ██████╗ ██╗     
██║██╔══██╗╚██╗██╔╝╚══██╔══╝██╔═══██╗██╔═══██╗██║     
██║██████╔╝ ╚███╔╝    ██║   ██║   ██║██║   ██║██║       by: dking
██║██╔═══╝  ██╔██╗    ██║   ██║   ██║██║   ██║██║     
██║██║     ██╔╝ ██╗   ██║   ╚██████╔╝╚██████╔╝███████╗    
╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
#################################################################\n`)

rl.question('Please enter the IP to check: ', (ip_address) => {
  const parameters = {
    ipAddress: ip_address,
    maxAgeInDays: '90',
  };

  fetch(`${url}?${new URLSearchParams(parameters)}`, {
    headers: {
      Accept: 'application/json',
      Key: API_KEY,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log('Resultados:', json);

      const data = json.data;

      if (!data) {
        console.error('Error: No data in API response');
        return;
      }

      results.push(data);

      const output = results.map((data) =>
        csv_columns.map((column) => data[column])
      );
      output.unshift(csv_columns);

      fs.writeFile('D:/Backup/Projects/ipx/path/AbuseIP_results.csv', output.join('\n'), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('AbuseIP_results.csv created successfully!');
      });
    })
    .catch((error) => {
      console.error('API Error:', error);
    });

  rl.close();
});
