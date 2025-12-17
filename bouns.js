/*
    Given an array nums of size n, return the majority element.

    The majority element is the element that appears more than ⌊n / 2⌋ times. 
    You may assume that the majority element always exists in the array.

    Example 1:
        Input: nums = [3,2,3]
        Output: 3

    Example 2:
        Input: nums = [2,2,1,1,1,2,2]
        Output: 2
*/



function majorityElement(nums) {
    const freq = {};
    // What this line does is to initialize the candidate variable with the first element of the nums array.
    let candidate = nums[0]; // Initialize candidate with the first element

    for (let i = 0; i < nums.length; i++) {
        // Get the current number from the nums array.
        const num = nums[i];
        // Update the frequency count for the current number.
        freq[num] = (freq[num] ?? 0) + 1; 
        // Check if the current number has a higher frequency than the current candidate.
        if (freq[num] > freq[candidate]) {
        candidate = num;
        }
    }
    return candidate;
}

// Example usage:
console.log(majorityElement([3, 2, 3])); // Output: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2
console.log(majorityElement([4,4,4,4,4,5,6,5,5,6])); // Output: 4
