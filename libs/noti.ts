import { showNotification } from "@mantine/notifications";

function sliceString(str: string) {
  return str.length > 50 ? `${str.slice(0, 50)}...` : str;
}

export const createdUser = () =>
  showNotification({
    title: "Account created",
    message:
      "Your account has been created. Please login to confirm your new account.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-green"],
      },
    }),
  });

export const updateDeliInfo = () =>
  showNotification({
    title: "Updated delivery information",
    message: "New delivery address is updated",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-green"],
      },
    }),
  });

export const addNewToCart = (name: string) => {
  showNotification({
    title: "Add new item to cart",
    message: `${sliceString(name)} has been added to your cart.`,
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-green"],
      },
    }),
  });
};

export const addToFavoried = (name: string) => {
  showNotification({
    title: "Add new item to favorites",
    message: `${sliceString(name)} has been added to your favorites.`,
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-pink"],
      },
    }),
  });
};

export const loginRequired = () => {
  showNotification({
    title: "Login required",
    message: "This action requires you to be logged in.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-red"],
      },
    }),
  });
};

export const limitQuantity = () => {
  showNotification({
    title: "Item limit reached",
    message: "You can add maxium 10 into your cart.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-red"],
      },
    }),
  });
};

export const fileLimitReach = () => {
  showNotification({
    title: "File limit reached",
    message: "Uploaded image maximum is 1 MB.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-red"],
      },
    }),
  });
};

export const newAvaSaved = () => {
  showNotification({
    title: "A new avatar uploaded",
    message: "Your new avatar has been saved.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-green"],
      },
    }),
  });
};

export const failedPlacingOrder = () => {
  showNotification({
    title: "Failed to place your order",
    message:
      "Your order has not been placed for unknown reasons, please try again later.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-red"],
      },
    }),
  });
};

export const reviewPosted = () => {
  showNotification({
    title: "New review has been posted",
    message: "Your review have been saved and can not be deleted.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-green"],
      },
    }),
  });
};

export const failedPostReview = () => {
  showNotification({
    title: "Failed to save your review",
    message:
      "Something happens that prevents to saved your review. Please try later.",
    styles: (theme) => ({
      root: {
        borderColor: theme.colors["pastel-red"],
      },
    }),
  });
};
