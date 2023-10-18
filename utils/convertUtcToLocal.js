function convertUtcToLocal(utcTimestamp) {
    const utcDate = new Date(utcTimestamp);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Convert UTC to user's local time zone
    const localDate = utcDate.toLocaleString('en-US', { timeZone: userTimeZone });
    
    return localDate;
  }