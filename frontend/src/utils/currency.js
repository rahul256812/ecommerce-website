// Currency conversion utility
export const USD_TO_INR_RATE = 92.72; // Current exchange rate

/**
 * Convert USD to INR
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in INR
 */
export const convertToINR = (usdAmount) => {
    return Math.round(usdAmount * USD_TO_INR_RATE * 100) / 100;
};

/**
 * Format amount with Indian Rupee symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with ₹ symbol
 */
export const formatINR = (amount) => {
    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/**
 * Convert USD to INR and format
 * @param {number} usdAmount - Amount in USD
 * @returns {string} Formatted amount in INR
 */
export const convertAndFormatINR = (usdAmount) => {
    const inrAmount = convertToINR(usdAmount);
    return formatINR(inrAmount);
};

/**
 * Format amount with USD symbol (for comparison)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with $ symbol
 */
export const formatUSD = (amount) => {
    return `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};
