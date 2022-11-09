function imageTesting(src: string) {
  return new Promise(function imgPromise(resolve, reject) {
    let img: HTMLImageElement = new Image();
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
    img.src = src;
  });
}

export default async function checkValidImageSrc(src: string) {
  return imageTesting(src)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
