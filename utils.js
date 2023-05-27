function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = [];
  
    // Initialize the dynamic programming table
    for (let i = 0; i <= m; i++) {
        dp[i] = [];
        dp[i][0] = i;
    }
  
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
  
    // Fill in the rest of the table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // Deletion
                dp[i][j - 1] + 1, // Insertion
                dp[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }
  
    return dp[m][n];
}

function findDictKeyWithClosestLevenshteinDistance(dict, key, maxDistanceAllowed=4) {
    let minDistance = Infinity;
    let minKey = null;
    for (let dictKey of Object.keys(dict)) {
        let distance = levenshteinDistance(dictKey, key);
        if (distance <= maxDistanceAllowed) {
            if (distance < minDistance) {
                minDistance = distance;
                minKey = dictKey;
            }
        }
    }
    return minKey;
}