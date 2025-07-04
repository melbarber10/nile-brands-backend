// Create a date for February 1st, 2025 with specific time
const date = new Date('2025-02-01');
date.setUTCHours(20, 42, 5, 349);

console.log('Formatted date:', date.toISOString());  // Will output: 2025-02-01T20:42:05.349Z

// You can also create it directly with the ISO string
const directDate = new Date('2025-02-01T20:42:05.349Z');
console.log('Direct formatted date:', directDate.toISOString());

// To create a new date with the same time format
const createDateWithTime = (dateString) => {
  const newDate = new Date(dateString);
  newDate.setUTCHours(20, 42, 5, 349);
  return newDate;
};

// Example for different dates
console.log('\nDifferent dates with same time format:');
console.log('Feb 1:', createDateWithTime('2025-02-01').toISOString());
console.log('Feb 9:', createDateWithTime('2025-02-09').toISOString());
console.log('Mar 1:', createDateWithTime('2025-03-01').toISOString()); 