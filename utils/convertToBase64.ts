export default function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    let baseURL = "";
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      baseURL = reader.result as string;
      resolve(baseURL);
    };
  });
}
