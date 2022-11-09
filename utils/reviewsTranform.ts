import { REVIEW } from "../interfaces/review";

export default function reviewsTranform(list: any[], id: number) {
  let reviews = list.map((i) => {
    const attributes = i.attributes;
    const rawReviewer = attributes.reviewer.data.attributes;
    const rawImg = attributes.imgs.data;
    let avaUrl = "";

    if (rawReviewer.avatar.data && rawReviewer.avatar.data.attributes) {
      const rawAvatar = rawReviewer.avatar.data.attributes;
      avaUrl = rawAvatar.hash + rawAvatar.ext;
    }

    const rawTime = attributes.createdAt.slice(0, -1).split("T").join(" ");
    const time = new Date(rawTime);

    return {
      id: i.id,
      content: attributes.content,
      rating: attributes.rating,
      product: id,
      createdAt: time.getTime(),
      imgs: rawImg.map((j: any) => {
        return {
          hash: j.attributes.hash,
          url: j.attributes.url,
        };
      }),
      reviewer: {
        id: rawReviewer.userId,
        username: rawReviewer.username,
        avatar: avaUrl,
      },
    } as REVIEW;
  });

  return reviews;
}
