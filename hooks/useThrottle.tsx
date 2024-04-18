// 节流 hook，在一定时间后再返回最新的值

import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useThrottle(value: any, delay: number) {
    const [throttledValue, setThrottledValue] = useState(value);
    const [lastRun, setLastRun] = useState(Date.now()); // 上次运行时间
    
    useEffect(() => {
        const handler = setTimeout(() => {
            // 如果经过的时间已经大于设定的 delay 时间时，更新节流值
            if (Date.now() - lastRun >= delay) {
                setThrottledValue(value);
                setLastRun(Date.now()); // 更新上次运行时间
            }
        }, delay - (Date.now() - lastRun)); // 中间程序运行需要时间，减去这部分时间

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return throttledValue;
}

export default useThrottle;