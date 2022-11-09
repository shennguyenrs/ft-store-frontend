import axios from "axios";
import { BASE64_IMG, REVIEW_PAYLOAD } from "../interfaces/review";
import { CMS_API, CMS_HEADER, CMS_REF, CMS_ROUTES } from "../libs/constants";
import { allReviewsByPerson, allReviewsImgs, itemByName } from "./queries";
import FormData from "form-data";

// Users
export async function uploadNewPerson(data: {
  userId: string;
  avatar?: number;
  username: string;
}) {
  try {
    await axios.post(
      `${CMS_API}/people`,
      {
        data: data,
      },
      CMS_HEADER
    );
  } catch (err) {
    throw err;
  }
}

export async function uploadAvatar(
  fileStr: string,
  userId: string,
  sId: string
) {
  try {
    const base64Str = JSON.parse(fileStr).base64;
    const bufferFromBase64 = Buffer.from(
      base64Str.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const formData = new FormData();
    formData.append("files", bufferFromBase64, `${userId}.png`);
    formData.append("ref", CMS_REF.person);
    formData.append("refId", `${Number(sId)}`);
    formData.append("field", "avatar");

    // Upload new avatar
    const { data } = await axios.post(`${CMS_API}/upload`, formData, {
      headers: {
        ...CMS_HEADER.headers,
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });

    if (data) {
      return data;
    }

    return null;
  } catch (err) {
    throw err;
  }
}

export async function deleteOldAva(userId: string) {
  try {
    const repeatedImgs = await axios.get(
      `${CMS_API}/${CMS_ROUTES.files}?${itemByName(userId)}`,
      CMS_HEADER
    );

    const dataLength = repeatedImgs.data.length;

    for (let i = 0; i < dataLength; i++) {
      await axios.delete(
        `${CMS_API}/${CMS_ROUTES.files}/${repeatedImgs.data[i].id}`,
        CMS_HEADER
      );
    }
  } catch (err) {
    throw err;
  }
}

export async function deletePerson(userId: string, suId: number) {
  try {
    deleteOldAva(userId);
    await axios.delete(`${CMS_API}/${CMS_ROUTES.people}/${suId}`, CMS_HEADER);
  } catch (err) {
    throw err;
  }
}

// Reviews
export async function uploadReviewImgs(payload: REVIEW_PAYLOAD) {
  try {
    const { data: content, imgs } = payload;
    const parsedImgs = JSON.parse(imgs) as BASE64_IMG[];

    const contentUploaded = await axios.post(
      `${CMS_API}/reviews`,
      { data: content },
      CMS_HEADER
    );

    if (!contentUploaded.data) return null;

    if (parsedImgs.length) {
      const reviewId = contentUploaded.data.data.id;
      const formData = new FormData();
      formData.append("ref", CMS_REF.review);
      formData.append("refId", reviewId);
      formData.append("field", "imgs");

      for (let i = 0; i < parsedImgs.length; i += 1) {
        const bufferFromBase64 = Buffer.from(
          parsedImgs[i].base64.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        formData.append(
          "files",
          bufferFromBase64,
          `r${reviewId}_${content.product}_${content.reviewer}_${i}.${parsedImgs[i].ext}`
        );
      }

      const filesUploaded = await axios.post(`${CMS_API}/upload`, formData, {
        headers: {
          ...CMS_HEADER.headers,
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        },
      });

      const savedImgs = filesUploaded.data.map((i: any) => {
        return {
          hash: i.hash,
          url: i.url,
        };
      });

      return {
        id: reviewId,
        imgs: savedImgs,
      };
    }
  } catch (err) {
    throw err;
  }
}

export async function deleteReview(reviewId: number) {
  try {
    // Delete review images
    const rawImgs = await axios.get(
      `${CMS_API}/${CMS_ROUTES.reviews}/${reviewId}?${allReviewsImgs()}`
    );

    const ids = rawImgs.data.data.attributes.imgs.data.map((i: any) => i.id);

    if (ids.length) {
      for (let i = 0; i < ids.length; i += 1) {
        await axios.delete(
          `${CMS_API}/${CMS_ROUTES.files}/${ids[i]}`,
          CMS_HEADER
        );
      }
    }

    // Delete review content
    await axios.delete(
      `${CMS_API}/${CMS_ROUTES.reviews}/${reviewId}`,
      CMS_HEADER
    );
  } catch (err) {
    throw err;
  }
}

export async function getUserIdAndReviews(userId: string) {
  try {
    const userWithReviews = await axios.get(
      `${CMS_API}/${CMS_ROUTES.people}?${allReviewsByPerson(userId)}`
    );

    const rawReviews = userWithReviews.data.data[0].attributes.reviews.data;
    const suId = userWithReviews.data.data[0].id;

    return { suId, rawReviews };
  } catch (err) {
    return { suId: null, rawReviews: null };
  }
}
