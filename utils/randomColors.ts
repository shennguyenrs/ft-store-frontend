// Pick random color code from array
const colorName: string[] = [
  'pastel-pink',
  'pastel-purple',
  'pastel-darker-blue',
  'pastel-blue',
  'pastel-green',
  'pastel-yellow',
  'pastel-orange',
  'pastel-red',
];

// Return array of random postion of colorname
export default function randomColors(): string[] {
  const random = [];
  for (let i = 0; i < colorName.length; i += 1) {
    random.push(colorName[Math.floor(Math.random() * colorName.length)]);
  }
  return random;
}
