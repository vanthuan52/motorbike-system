import { NOT_A_NUMBER } from "@/constants/application";

export const dateHelper = {
  formatDateToVietnamese: (
    dateString: string | Date | null | undefined,
    hasHour: boolean = false
  ) => {
    if (!dateString || dateString === null) {
      return NOT_A_NUMBER;
    }

    let date: Date;

    if (typeof dateString === "string") {
      date = new Date(dateString);
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      return "Invalid Date";
    }

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    if (hasHour) {
      return `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${formattedDay}-${formattedMonth}-${year}`;
  },
};
