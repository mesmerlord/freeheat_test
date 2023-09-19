import { showNotification } from "@mantine/notifications";
export const errorNotification = (error: any) => {
  const errorMessageDict = {
    Title: "Error",
    Message: "An error occurred. Please try again later.",
  };
  if (error && error?.response && error?.response?.data) {
    const errorMessage = Object.values(error?.response?.data);
    errorMessageDict.Message = errorMessage.join(" ");
  }
  showNotification({
    title: errorMessageDict.Title,
    message: errorMessageDict.Message,
    color: "red",
  });
};
