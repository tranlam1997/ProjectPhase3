 exports.randomNum = (min,max, count = 1) => {
    let nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * (max-min) + min));
    }
    return [...nums];
}