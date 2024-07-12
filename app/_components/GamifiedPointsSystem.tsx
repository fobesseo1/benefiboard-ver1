import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GamifiedPointsSystem: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (coins >= 10) {
      setShowRewards(true);
    }
  }, [coins]);

  const handleScreenTap = () => {
    setCoins(coins + 1);
  };

  const coinVariants = {
    initial: { scale: 0, y: 50 },
    animate: { scale: 1, y: 0 },
    exit: { scale: 0, y: -50 },
  };

  const rewardVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  };

  const rewards = ['커피 쿠폰', '영화 티켓', '기부', '아바타 아이템'];

  return (
    <div
      className="h-screen w-screen bg-gradient-to-br from-purple-400 to-blue-500 flex flex-col items-center justify-center"
      onClick={handleScreenTap}
    >
      <motion.h2
        className="text-3xl font-bold text-white mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        즐기면서 모으고, 쓰면서 나누어요!
      </motion.h2>

      <div className="relative w-40 h-40">
        <AnimatePresence>
          {[...Array(coins)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold"
              variants={coinVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
              }}
            >
              $
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.p
        className="text-xl text-white mt-4"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        화면을 터치하세요!
      </motion.p>

      <AnimatePresence>
        {showRewards && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            variants={rewardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">보상이 터졌어요!</h3>
              <div className="grid grid-cols-2 gap-4">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    className="bg-blue-100 p-4 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {reward}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamifiedPointsSystem;
