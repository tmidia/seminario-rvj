const pdf = require('pdf-parse');
console.log('PDF Type:', typeof pdf);
console.log('PDF value:', pdf);
if (pdf.default) console.log('PDF Default Type:', typeof pdf.default);
