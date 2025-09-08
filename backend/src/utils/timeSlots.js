export function generateSlots(start = '06:00', end = '23:00') {
const result = [];
let [h, m] = start.split(':').map(Number);
const [eh, em] = end.split(':').map(Number);
while (h < eh || (h === eh && m < em)) {
const hh = String(h).padStart(2, '0');
const mm = String(m).padStart(2, '0');
result.push(`${hh}:${mm}`);
h += 1; // hourly slots
}
return result;
}