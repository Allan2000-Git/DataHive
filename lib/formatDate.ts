import moment from "moment";

export const formatDate = (time: number) => {
    // Assuming file._creationTime is a timestamp or a Date object
    const creationTime = moment(time);
    const now = moment();

    let displayTime;
    if (now.diff(creationTime, 'day') >= 1) {
        // If the difference is more than or equal to 1 day, display the date
        displayTime = creationTime.format('MMMM Do YYYY');
    } else {
        // Otherwise, display relative time
        displayTime = creationTime.fromNow();
    }

    return displayTime;
}