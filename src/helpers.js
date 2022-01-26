const replaceNoneWithNotAvailable = (inputString) => {
    if (inputString === undefined || inputString == null) {
        return "Not Available";
    } else {
        return inputString;
    }
}

export default replaceNoneWithNotAvailable;