// splitprocessor.js – Revenue / payout splitter (updated for our plan)

const PLATFORM_CUT_NORMAL = 0.60;     // 60% you, 40% normal user
const PLATFORM_CUT_CREATOR = 0.30;    // 30% you, 70% creator
const FIRST_MONTH_CREATOR_CUT = 1.00; // 100% to creator in first month
const BOOST_CREATOR_CUT = 0.90;       // 90% to creator on boost tips

/**
 * Splits revenue from CPM impressions, CPA bounties, Boost tips, etc.
 * @param {number} totalAmount - amount in USD or BTC equivalent
 * @param {string} source - 'cpm', 'cpa', 'boost', 'referral'
 * @param {string} userType - 'normal', 'creator', 'demo'
 * @param {boolean} isFirstMonth - true if creator's first month
 * @returns {object} { platform: number, user: number, creator: number }
 */
export function splitRevenue(totalAmount, source = 'cpm', userType = 'normal', isFirstMonth = false) {
  if (userType === 'demo') {
    return { platform: totalAmount, user: 0, creator: 0 }; // demo gets nothing
  }

  let platformCut = 0;
  let userCut = 0;

  if (source === 'cpa' || source === 'referral') {
    // CPA bounties & referrals → 100% to platform (you)
    platformCut = totalAmount;
  } else if (source === 'boost') {
    // Boost tips → 90% creator, 10% platform
    platformCut = totalAmount * (1 - BOOST_CREATOR_CUT);
    userCut = totalAmount * BOOST_CREATOR_CUT;
  } else {
    // CPM / engagement
    if (userType === 'creator') {
      if (isFirstMonth) {
        platformCut = 0;
        userCut = totalAmount;
      } else {
        platformCut = totalAmount * PLATFORM_CUT_CREATOR;
        userCut = totalAmount * (1 - PLATFORM_CUT_CREATOR);
      }
    } else {
      // normal user
      platformCut = totalAmount * PLATFORM_CUT_NORMAL;
      userCut = totalAmount * (1 - PLATFORM_CUT_NORMAL);
    }
  }

  return {
    platform: Number(platformCut.toFixed(8)),
    user: Number(userCut.toFixed(8)),
    creator: userType === 'creator' ? Number(userCut.toFixed(8)) : 0
  };
}

// Example usage:
// const result = splitRevenue(1.00, 'cpm', 'creator', true);
// console.log(result); // { platform: 0, user: 1.00, creator: 1.00 }
