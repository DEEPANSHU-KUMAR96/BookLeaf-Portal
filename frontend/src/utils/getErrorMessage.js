/** Turns any API/network error into one readable message for the UI. */
export function getErrorMessage(err) {
    
    const data = err.response?.data;
    if (data?.details?.[0]?.message) return data.details[0].message; // first validation message
    if (data?.error) return data.error;
    if (err.code === "ERR_NETWORK") return "Cannot reach the server. Check your connection";
    return "Something went wrong. Please try again";
}