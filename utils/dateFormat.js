import moment from "moment";

export default function formatDate(uploadTimeStr) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = moment().tz(userTimeZone);
  const uploadTime = moment.utc(uploadTimeStr).tz(userTimeZone);

  const timeDiffSeconds = now.diff(uploadTime, "seconds");

  if (timeDiffSeconds < 60) {
      return 'Just-now';
  }

  const isSameDay = now.isSame(uploadTime, "day");
  if (isSameDay) {
      return uploadTime.format('hh:mm A'); // This will give you a format like "05:00 PM"
  }

  return uploadTime.format('MM/DD/YY'); // This will give you a format like "10/08/23"
}
