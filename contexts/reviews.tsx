import axios from "axios";
import { createContext, ReactElement, useMemo, useState } from "react";
import { RAW_REVIEW, REVIEW } from "../interfaces/review";
import { REVIEWER } from "../interfaces/user";
import { API_ROUTES } from "../libs/constants";
import { failedPostReview, reviewPosted } from "../libs/noti";

interface RVCTX_STATES {
  reviews: REVIEW[];
  spId: number;
  currAvgRating: number;
  currRatingAmount: number;
  orderers: string[];
}

export interface REVIEWCTX {
  reviews: REVIEW[] | [];
  orderers: string[] | [];
  handleSetStates: (values: RVCTX_STATES) => void;
  handlePostNewReview: (review: RAW_REVIEW, fullReviewer: REVIEWER) => void;
}

export const ReviewContext = createContext<REVIEWCTX>({
  reviews: [],
  orderers: [],
  handleSetStates: () => { },
  handlePostNewReview: () => { },
});

export default function ReviewProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [reviews, setReviews] = useState<REVIEWCTX["reviews"]>([]);
  const [spId, setSpId] = useState<number>(0);
  const [currAvgRating, setCurrAvgRating] = useState<number>(0);
  const [currRatingAmount, setCurrRatingAmount] = useState<number>(0);
  const [orderers, setOrderers] = useState<string[]>([]);

  const handleSetStates = (values: RVCTX_STATES) => {
    setReviews(values.reviews);
    setSpId(values.spId);
    setCurrAvgRating(values.currAvgRating);
    setCurrRatingAmount(values.currRatingAmount);
    setOrderers(values.orderers);
  };

  const handlePostNewReview = async (
    newReview: RAW_REVIEW,
    fullReviewer: REVIEWER
  ) => {
    if (spId === 0) {
      failedPostReview();
      return;
    }

    try {
      const payload = {
        data: {
          content: newReview.content,
          rating: newReview.rating,
          reviewer: newReview.reviewer,
          product: spId,
        },
        imgs: newReview.imgs,
      };

      const { data } = await axios.post(`${API_ROUTES.reviews}`, payload);

      if (!data) {
        failedPostReview();
        return;
      }

      let raw = [...reviews];

      raw.push({
        ...payload.data,
        imgs: data.imgs,
        id: data.id,
        createdAt: Date.now(),
        reviewer: fullReviewer,
      });

      // Update states
      setReviews(raw);

      // NOTE: Product rating and review count will not appear after reload page
      // Update product rating and review count
      const newRating = {
        avgRating:
          ((currRatingAmount * currAvgRating + newReview.rating) * 10) / 10,
        ratingAmount: currRatingAmount + 1,
      };

      const { status } = await axios.put(
        `${API_ROUTES.products}/${spId}`,
        newRating
      );

      if (status === 200) {
        // Fire noti
        reviewPosted();
      }
    } catch (err) {
      //TODO: Fire noti fail upload new rating
      return;
    }
  };

  const ctxInput = useMemo(() => {
    return {
      reviews,
      orderers,
      handleSetStates,
      handlePostNewReview,
    };
  }, [reviews, orderers]);

  return (
    <ReviewContext.Provider value={ctxInput}>{children}</ReviewContext.Provider>
  );
}
