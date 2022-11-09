export default function splitInfo(info: string): string[] {
  return info.split('|').map((line) =>
    line
      .split(' ')
      .filter((i) => i !== ' ')
      .join(' ')
  );
}
