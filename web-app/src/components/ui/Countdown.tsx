// Countdown 倒计时组件
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  seconds: number;
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ seconds, onComplete }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  // 进度百分比
  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-6 mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Clock className="text-orange-600 mr-2" size={24} />
          <span className="text-sm text-orange-800 font-medium">监督机制倒计时</span>
        </div>
        
        {/* 倒计时数字 */}
        <div className="text-5xl font-bold text-orange-600 mb-2">
          {remaining} 秒
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-orange-200 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 提示文字 */}
        <p className="text-sm text-orange-700">
          {remaining > 0 ? '请认真复习，倒计时结束后才能提交' : '倒计时已结束，现在可以提交复习结果'}
        </p>
      </div>
    </div>
  );
};
