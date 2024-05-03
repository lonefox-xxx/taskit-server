function GetTimestampOfFirstDayOfYear() {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1, 0, 0, 0).getTime()
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59).getTime()
    return { startDate, endDate };
}

module.exports = GetTimestampOfFirstDayOfYear;