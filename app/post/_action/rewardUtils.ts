export function generateRewards(cycleLength, totalPoints, bigRewardThreshold) {
  let rewards = Array(cycleLength).fill(0);
  let bigRewardIndex = Math.floor(Math.random() * cycleLength);
  let bigReward =
    Math.floor(Math.random() * (totalPoints - (cycleLength - 1) - bigRewardThreshold + 1)) +
    bigRewardThreshold;

  rewards[bigRewardIndex] = bigReward;
  let remainingPoints = totalPoints - bigReward;

  for (let i = 0; i < cycleLength; i++) {
    if (i !== bigRewardIndex) {
      let maxPossible = Math.min(remainingPoints, Math.floor(totalPoints / cycleLength));
      rewards[i] = Math.floor(Math.random() * (maxPossible + 1));
      remainingPoints -= rewards[i];
    }
  }

  let remainingIndices = rewards.reduce((indices, reward, index) => {
    if (index !== bigRewardIndex) indices.push(index);
    return indices;
  }, []);

  if (remainingPoints > 0) {
    let randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    rewards[randomIndex] += remainingPoints;
  }

  return rewards;
}
