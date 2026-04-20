import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { RobotState } from '../types';

interface RobotFaceProps {
  state: RobotState;
}

export default function RobotFace({ state }: RobotFaceProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const stateRef = useRef<RobotState>(state);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimersRef = useRef<NodeJS.Timeout[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  // 初始化广播通道
  useEffect(() => {
    channelRef.current = new BroadcastChannel('robot-control');
    return () => {
      channelRef.current?.close();
      // 清理所有定时器
      clearIdleTimers();
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = (msg: any) => {
    if (channelRef.current) {
      channelRef.current.postMessage(msg);
    }
  };

  // 清理所有idle相关的定时器 - 提前定义，避免引用问题
  const clearIdleTimers = () => {
    idleTimersRef.current.forEach(timer => clearTimeout(timer));
    idleTimersRef.current = [];
  };



  // 表情动画配置 - 简洁设计
  const expressionAnimations = {
    // 开心
    happy: () => {
      const tl = gsap.timeline();
      tl.to('[data-mouth]', { attr: { d: 'M 618 880 Q 800 1060 982 880 L 982 922 Q 800 1088 618 922 Z' } }, 0)
        .to('[data-pupil="left"]', { attr: { y: 400 } }, 0)
        .to('[data-pupil="right"]', { attr: { y: 400 } }, 0)
        .duration(0.5);
      return tl;
    },

    // 左看
    lookLeft: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { x: 220 } }, 0)
        .to('[data-pupil="right"]', { attr: { x: 860 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 660 840 Q 800 900 940 840 L 940 882 Q 800 922 660 882 Z' } }, 0)
        .duration(0.6);
      return tl;
    },

    // 右看
    lookRight: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { x: 380 } }, 0)
        .to('[data-pupil="right"]', { attr: { x: 1020 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 660 840 Q 800 900 940 840 L 940 882 Q 800 922 660 882 Z' } }, 0)
        .duration(0.6);
      return tl;
    },

    // 思考
    thinking: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { x: 240, y: 340 } }, 0)
        .to('[data-pupil="right"]', { attr: { x: 880, y: 340 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 700 880 Q 800 840 900 880 L 900 922 Q 800 868 700 922 Z' } }, 0)
        .duration(0.6);
      return tl;
    },

    // 正常态（idle状态的默认动画）
    normal: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { x: 300, y: 380 } }, 0)
        .to('[data-pupil="right"]', { attr: { x: 940, y: 380 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 660 840 Q 800 980 940 840 L 940 882 Q 800 1008 660 882 Z' } }, 0)
        .duration(0.3);
      return tl;
    },

    // 生气
    angry: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { y: 460 } }, 0)
        .to('[data-pupil="right"]', { attr: { y: 460 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 640 940 Q 800 880 960 940 L 960 982 Q 800 908 640 982 Z' } }, 0)
        .duration(0.5);
      return tl;
    },

    // 伤心
    sad: () => {
      const tl = gsap.timeline();
      tl.to('[data-pupil="left"]', { attr: { y: 460, x: 260 } }, 0)
        .to('[data-pupil="right"]', { attr: { y: 460, x: 900 } }, 0)
        .to('[data-mouth]', { attr: { d: 'M 640 960 Q 800 880 960 960 L 960 1002 Q 800 908 640 1002 Z' } }, 0)
        .duration(0.5);
      return tl;
    },

    // 扫描 - 初始化眯眼和平嘴巴
    scanning: () => {
      const tl = gsap.timeline();
      // 眯眼：Y轴缩小到 0.7
      tl.to('[data-pupil="left"]', { attr: { height: 252, y: 454 } }, 0)
        .to('[data-pupil="right"]', { attr: { height: 252, y: 454 } }, 0)
        // 使用和thinking一样的平嘴巴
        .to('[data-mouth]', { attr: { d: 'M 700 880 Q 800 840 900 880 L 900 922 Q 800 868 700 922 Z' } }, 0);
      return tl;
    },

    // 爱心 - 眼睛变爱心，在原地弹动（放大缩小），同步节奏，2秒
    love: () => {
      const tl = gsap.timeline();
      // 隐藏矩形眼睛，显示爱心
      tl.to('[data-pupil="left"]', { attr: { opacity: 0 } }, 0)
        .to('[data-pupil="right"]', { attr: { opacity: 0 } }, 0)
        .to('[data-heart="left"]', { attr: { opacity: 1 } }, 0)
        .to('[data-heart="right"]', { attr: { opacity: 1 } }, 0)
        // 改变嘴巴形状为大笑：弯得更厉害，宽度更小
        .to('[data-mouth]', { attr: { d: 'M 700 880 Q 800 1000 900 880 L 900 922 Q 800 1028 700 922 Z' } }, 0);
      
      // 爱心在原地同步弹动：节奏变慢，持续2秒
      // 第一次弹动
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, 0.2)
        .to('[data-heart="right"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, '<');
      
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '<');
      
      // 第二次弹动
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, '<');
      
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '<');
      
      // 第三次弹动
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(1.2)' }, duration: 0.25 }, '<');
      
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(0.9)' }, duration: 0.25 }, '<');
      
      // 恢复到正常大小
      tl.to('[data-heart="left"]', { attr: { transform: 'scale(1.0)' }, duration: 0.2 }, '-=0.125')
        .to('[data-heart="right"]', { attr: { transform: 'scale(1.0)' }, duration: 0.2 }, '<');
      
      tl.duration(2.0);
      return tl;
    },

    // 惊讯 - 眼睛放大，O嘴稳定显示（不闪烁），眨眼重复两次，持续2秒
    surprise: () => {
      const tl = gsap.timeline();
      
      // 0-0.3s: 眼睛放大到1.5倍（从360×360到540×540）
      tl.to('[data-pupil="left"]', { attr: { width: 540, height: 540, x: 210, y: 290 }, duration: 0.3 }, 0)
        .to('[data-pupil="right"]', { attr: { width: 540, height: 540, x: 850, y: 290 }, duration: 0.3 }, '<');
      
      // 0-0.3s: 嘴巴快速缩小消失
      tl.to('[data-mouth]', { scaleX: 0, transformOrigin: '50% 50%', duration: 0.001 }, 0);
      
      // 0s: O字母立即出现（小状态，scale:0.2）
      tl.set('[data-mouth-o]', { attr: { opacity: 1, transform: 'scale(0.2)' } }, 0);
      
      // 0.1-0.5s: O字母放大到正常大小
      tl.to('[data-mouth-o]', { attr: { transform: 'scale(1)' }, duration: 0.4 }, 0.1);
      
      // 0.5-0.9s: 停留，O嘴保持不变
      tl.to('[data-pupil="left"]', { duration: 0.4 }, 0.5);
      
      // 0.9-1.1s: 第一组眨眼两次
      // 第一下眨
      tl.to('[data-pupil="left"]', { attr: { height: 0, y: 560 }, duration: 0.1 }, 0.9)
        .to('[data-pupil="right"]', { attr: { height: 0, y: 560 }, duration: 0.1 }, '<');
      // 第一下打开
      tl.to('[data-pupil="left"]', { attr: { height: 540, y: 290 }, duration: 0.1 }, '-=0')
        .to('[data-pupil="right"]', { attr: { height: 540, y: 290 }, duration: 0.1 }, '<');
      
      // 第二下眨
      tl.to('[data-pupil="left"]', { attr: { height: 0, y: 560 }, duration: 0.1 }, 0.1)
        .to('[data-pupil="right"]', { attr: { height: 0, y: 560 }, duration: 0.1 }, '<');
      // 第二下打开
      tl.to('[data-pupil="left"]', { attr: { height: 540, y: 290 }, duration: 0.1 }, '-=0')
        .to('[data-pupil="right"]', { attr: { height: 540, y: 290 }, duration: 0.1 }, '<');
      
      // 1.1-1.5s: 停留，O嘴保持不变
      tl.to('[data-pupil="left"]', { duration: 0.4 }, 1.1);
      
      // 1.5-1.7s: 第二组眨眼两次
      // 第三下眨
      tl.to('[data-pupil="left"]', { attr: { height: 0, y: 560 }, duration: 0.05 }, 1.5)
        .to('[data-pupil="right"]', { attr: { height: 0, y: 560 }, duration: 0.05 }, '<');
      // 第三下打开
      tl.to('[data-pupil="left"]', { attr: { height: 540, y: 290 }, duration: 0.05 }, '-=0')
        .to('[data-pupil="right"]', { attr: { height: 540, y: 290 }, duration: 0.05 }, '<');
      
      // 第四下眨
      tl.to('[data-pupil="left"]', { attr: { height: 0, y: 560 }, duration: 0.05 }, 0.1)
        .to('[data-pupil="right"]', { attr: { height: 0, y: 560 }, duration: 0.05 }, '<');
      // 第四下打开
      tl.to('[data-pupil="left"]', { attr: { height: 540, y: 290 }, duration: 0.05 }, '-=0')
        .to('[data-pupil="right"]', { attr: { height: 540, y: 290 }, duration: 0.05 }, '<');
      
      // 1.7-2.0s: 停留，O嘴保持可见
      tl.to('[data-mouth-o]', { attr: { opacity: 1, transform: 'scale(1)' }, duration: 0.3 }, 1.7);
      
      tl.duration(2.0);
      return tl;
    },
  };

  // 重置表情到中立（直接重置，不创建动画）
  const resetExpression = () => {
    // 直接设置属性值，不创建gsap动画，避免与后续动画冲突
    gsap.set('[data-pupil="left"]', { attr: { x: 300, y: 380, width: 360, height: 360, opacity: 1 } });
    gsap.set('[data-pupil="right"]', { attr: { x: 940, y: 380, width: 360, height: 360, opacity: 1 } });
    gsap.set('[data-heart="left"]', { attr: { opacity: 0, transform: 'scale(1)' } });
    gsap.set('[data-heart="right"]', { attr: { opacity: 0, transform: 'scale(1)' } });
    gsap.set('[data-mouth]', { attr: { d: 'M 660 840 Q 800 980 940 840 L 940 882 Q 800 1008 660 882 Z', opacity: 1 }, scaleX: 1 });
    gsap.set('[data-mouth-o]', { attr: { opacity: 0 } });
  };

  // 播放表情动画
  const playExpression = (expressionName: keyof typeof expressionAnimations) => {
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    // 只在回到 normal 时重置
    if (expressionName === 'normal') {
      resetExpression();
    }

    const animation = expressionAnimations[expressionName];
    if (animation) {
      const tl = animation();
      animationTimelineRef.current = tl;
    }
  };

  // 持续扫描循环
  const scheduleScanningCycle = () => {
    // 检查当前状态是否仍为扫描
    if (stateRef.current !== 'scanning') return;

    const tl = gsap.timeline();
    
    // 随机眼睛状态：1（正常）或 0.7（眯眼）
    const eyeScale = Math.random() < 0.5 ? 1 : 0.7;
    const eyeHeight = eyeScale === 1 ? 360 : 252;
    const eyeY = eyeScale === 1 ? 380 : 454;
    
    // 眼睛快速变为随机状态
    tl.to('[data-pupil="left"]', { attr: { height: eyeHeight, y: eyeY }, duration: 0.2 }, 0)
      .to('[data-pupil="right"]', { attr: { height: eyeHeight, y: eyeY }, duration: 0.2 }, '<');
    
    // 扫描持续时间（0.5-3秒）
    const scanDuration = 0.5 + Math.random() * 2;
    const scanSteps = Math.ceil(scanDuration / 0.6); // 每个往返 0.6 秒
    
    let currentTime = 0.2; // 从 0.2s 开始扫视（让眼睛先变化）
    for (let i = 0; i < scanSteps; i++) {
      // 左扫
      tl.to('[data-pupil="left"]', { attr: { x: 220 }, duration: 0.3 }, currentTime)
        .to('[data-pupil="right"]', { attr: { x: 860 }, duration: 0.3 }, '<');
      currentTime += 0.3;
      
      // 右扫
      tl.to('[data-pupil="left"]', { attr: { x: 380 }, duration: 0.3 }, currentTime)
        .to('[data-pupil="right"]', { attr: { x: 1020 }, duration: 0.3 }, '<');
      currentTime += 0.3;
    }
    
    const scanEndTime = currentTime;
    
    // 随机停留 0.5-1 秒
    const pauseDuration = 0.5 + Math.random() * 0.5;
    const pauseStartTime = scanEndTime;
    
    // 停留开始后 0.3 秒内，眼睛 Y 轴恢复到正常大小
    tl.to('[data-pupil="left"]', { attr: { height: 360, y: 380 }, duration: 0.3 }, pauseStartTime)
      .to('[data-pupil="right"]', { attr: { height: 360, y: 380 }, duration: 0.3 }, '<');
    
    // 停留期间必眨眼，随机眨 1-2 次
    const blinkCount = Math.random() < 0.5 ? 1 : 2;
    // 随机眨眼开始时间（在恢复完成后的 0.3s-0.8s 之间）
    const blinkStartOffset = 0.3 + Math.random() * (pauseDuration - 0.3 - 0.2 * blinkCount);
    
    for (let i = 0; i < blinkCount; i++) {
      const currentBlinkTime = pauseStartTime + blinkStartOffset + i * 0.2;
      
      // 眨眼效果统一使用 idle 的标准效果：以 Y 轴中心为缩放中心
      // 闭合（0.05s）
      tl.to('[data-pupil="left"]', { attr: { height: 30, y: 745 }, duration: 0.05 }, currentBlinkTime)
        .to('[data-pupil="right"]', { attr: { height: 30, y: 745 }, duration: 0.05 }, '<');
      
      // 睁眼（0.05s）  
      tl.to('[data-pupil="left"]', { attr: { height: 360, y: 380 }, duration: 0.05 }, '-=0')
        .to('[data-pupil="right"]', { attr: { height: 360, y: 380 }, duration: 0.05 }, '<');
    }
    
    animationTimelineRef.current = tl;
    
    // 完整周期时间
    const totalDuration = scanEndTime + pauseDuration;
    
    // 等待本周期完成后，再次调度下一个周期
    animationTimeoutRef.current = setTimeout(() => {
      scheduleScanningCycle();
    }, totalDuration * 1000);
  };

  // 独立的眨眼循环 - 随机在任何时间出现
  const scheduleBlinking = () => {
    if (stateRef.current !== 'idle') return;

    // 随机 1-4 秒后出现眨眼
    const blinkDelay = 1000 + Math.random() * 3000;
    
    const newBlinkTimer = setTimeout(() => {
      // 再次检查状态
      if (stateRef.current !== 'idle') return;
      
      // 执行眨眼动画
      gsap.to('[data-pupil="left"]', { attr: { height: 30, y: 545 }, duration: 0.1 });
      gsap.to('[data-pupil="right"]', { attr: { height: 30, y: 545 }, duration: 0.1 });
      
      setTimeout(() => {
        if (stateRef.current !== 'idle') return;
        
        gsap.to('[data-pupil="left"]', { attr: { height: 360, y: 380 }, duration: 0.1 });
        gsap.to('[data-pupil="right"]', { attr: { height: 360, y: 380 }, duration: 0.1 });
        
        // 随机 30% 概率眨眼两次
        if (Math.random() < 0.3) {
          setTimeout(() => {
            if (stateRef.current !== 'idle') return;
            
            gsap.to('[data-pupil="left"]', { attr: { height: 30, y: 545 }, duration: 0.1 });
            gsap.to('[data-pupil="right"]', { attr: { height: 30, y: 545 }, duration: 0.1 });
            
            setTimeout(() => {
              if (stateRef.current !== 'idle') return;
              
              gsap.to('[data-pupil="left"]', { attr: { height: 360, y: 380 }, duration: 0.1 });
              gsap.to('[data-pupil="right"]', { attr: { height: 360, y: 380 }, duration: 0.1 });
              scheduleBlinking();
            }, 100);
          }, 100);
        } else {
          scheduleBlinking();
        }
      }, 100);
    }, blinkDelay);
    
    blinkTimeoutRef.current = newBlinkTimer;
  };

  // 随机播放闲置动画 - idle状态下的动画循环
  const scheduleIdleAnimation = () => {
    // 首次检查
    if (stateRef.current !== 'idle') return;

    const otherAnimations: (keyof typeof expressionAnimations)[] = [
      'lookLeft',
      'lookRight',
      'thinking',
      'happy',
    ];

    // 第一阶段：等待 1-2 秒后切换到其他动画（不再重复设置normal）
    const pauseDuration = 1000 + Math.random() * 1000;
    const pauseTimer = setTimeout(() => {
      if (stateRef.current !== 'idle') return;

      // 随机选择一个表情
      const animation = otherAnimations[Math.floor(Math.random() * otherAnimations.length)];
      console.log('[scheduleIdleAnimation] Switching to:', animation);
      setCurrentAnimation(animation);
      playExpression(animation);

      // 第二阶段：停留 3-8 秒后回到 normal
      const stayDuration = 3000 + Math.random() * 5000;
      const stayTimer = setTimeout(() => {
        if (stateRef.current !== 'idle') return;

        console.log('[scheduleIdleAnimation] Switching back to normal');
        
        // 平滑过渡动画：眼睛和嘴巴回到 normal 位置
        const transitionTl = gsap.timeline();
        transitionTl
          .to('[data-pupil="left"]', { attr: { x: 300, y: 380 } }, 0)
          .to('[data-pupil="right"]', { attr: { x: 940, y: 380 } }, 0)
          .to('[data-mouth]', { attr: { d: 'M 660 840 Q 800 980 940 840 L 940 882 Q 800 1008 660 882 Z' } }, 0)
          .duration(0.5);
        
        setCurrentAnimation('normal');
        animationTimelineRef.current = transitionTl;

        // 第三阶段：停留 1-2 秒后重新循环（回到normal后保持一段时间）
        const repeatPauseDuration = 1000 + Math.random() * 1000;
        const repeatTimer = setTimeout(() => {
          if (stateRef.current !== 'idle') {
            return;
          }
          console.log('[scheduleIdleAnimation] Restarting loop');
          scheduleIdleAnimation();
        }, repeatPauseDuration);
        
        idleTimersRef.current.push(repeatTimer);
      }, stayDuration);
      
      idleTimersRef.current.push(stayTimer);
    }, pauseDuration);
    
    idleTimersRef.current.push(pauseTimer);
  };

  // 处理状态变化
  useEffect(() => {
    stateRef.current = state;

    // 清理所有现有定时器
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }

    // 清理所有idle相关定时器
    clearIdleTimers();

    if (state === 'scanning') {
      // 强制重置眼睛到正常状态，避免从love/surprise状态遗留的眼睛形状
      resetExpression();
      playExpression('scanning');
      // 立即启动持续扫描循环
      animationTimeoutRef.current = setTimeout(scheduleScanningCycle, 300);
    } else if (state === 'thinking') {
      playExpression('scanning');
    } else if (state === 'love') {
      playExpression('love');
      // love动画完成后自动回到idle
      animationTimeoutRef.current = setTimeout(() => {
        stateRef.current = 'idle';
        sendMessage({ type: 'SET_STATE', state: 'idle' });
      }, 2000);
    } else if (state === 'surprise') {
      playExpression('surprise');
      // surprise动画完成后自动回到idle（2秒）
      animationTimeoutRef.current = setTimeout(() => {
        stateRef.current = 'idle';
        sendMessage({ type: 'SET_STATE', state: 'idle' });
      }, 2000);
    } else if (state === 'idle') {
      // 立即进入初始位置（normal）
      playExpression('normal');
      setCurrentAnimation('normal');
      // 启动眨眼循环和表情循环
      scheduleBlinking();
      // 立即启动idle动画循环
      scheduleIdleAnimation();
    }
  }, [state]);

  return (
    <div 
      className="relative bg-[#0a0a1a]"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        clipPath: 'none',
        WebkitClipPath: 'none',
        mask: 'none',
        WebkitMask: 'none'
      }}
    >
      {/* 机器人脸部 SVG - 简洁设计 */}
      <svg
        ref={svgRef}
        viewBox="-200 -200 2000 1800"
        style={{ 
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          filter: 'drop-shadow(0 0 60px rgba(0, 255, 255, 0.6))',
          overflow: 'visible',
          clipPath: 'none',
          WebkitClipPath: 'none',
          mask: 'none',
          WebkitMask: 'none',
          maskImage: 'none',
          WebkitMaskImage: 'none',
          display: 'block'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 眼睛青色发光 */}
          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 脸部容器 - 用于整体摇晃和上升 */}
        <g 
          data-face="container" 
          transform="translate(800, 570) scale(2) translate(-800, -570)"
          style={{ overflow: 'visible' }}
        >
          {/* 左眼 - 圆角矩形，以中央为锚点 */}
          <rect
            data-pupil="left"
            x="300"
            y="380"
            width="360"
            height="360"
            rx="90"
            ry="90"
            fill="#FFFFFF"
            style={{ transformOrigin: '480px 560px' }}
            filter="url(#eyeGlow)"
          />

          {/* 右眼 - 圆角矩形，以中央为锚点 */}
          <rect
            data-pupil="right"
            x="940"
            y="380"
            width="360"
            height="360"
            rx="90"
            ry="90"
            fill="#FFFFFF"
            style={{ transformOrigin: '1120px 560px' }}
            filter="url(#eyeGlow)"
          />

          {/* 左眼爱心 - 初始隐藏，以中央为锚点缩放 */}
          <path
            data-heart="left"
            d="M 480,435 C 390,360 285,360 285,450 C 285,540 345,600 480,705 C 615,600 675,540 675,450 C 675,360 570,360 480,435"
            fill="#FFFFFF"
            opacity="0"
            style={{ transformOrigin: '480px 570px' }}
            filter="url(#eyeGlow)"
          />

          {/* 右眼爱心 - 初始隐藏，以中央为锚点缩放 */}
          <path
            data-heart="right"
            d="M 1120,435 C 1030,360 925,360 925,450 C 925,540 975,600 1120,705 C 1225,600 1275,540 1275,450 C 1275,360 1210,360 1120,435"
            fill="#FFFFFF"
            opacity="0"
            style={{ transformOrigin: '1120px 570px' }}
            filter="url(#eyeGlow)"
          />

          {/* 嘴巴 - 月牙形，使用fill而不是stroke来避免裁切 */}
          <path
            data-mouth
            d="M 660 840 Q 800 980 940 840 L 940 882 Q 800 1008 660 882 Z"
            fill="#FFFFFF"
            stroke="none"
            style={{ transformOrigin: '800px 860px', overflow: 'visible' }}
            filter="url(#eyeGlow)"
          />

          {/* 惊讶时的O型嘴巴 - 初始隐藏，以中央为锚点 */}
          <text
            data-mouth-o
            x="800"
            y="860"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="160"
            fontWeight="bold"
            fill="#FFFFFF"
            opacity="0"
            style={{ transformOrigin: '800px 800px' }}
          >
            O
          </text>
        </g>
      </svg>
    </div>
  );
}
