import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData, width = 200, height = 200, loop = true, autoplay = true }) => {
  const container = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop,
      autoplay,
      animationData
    });

    return () => {
      anim.destroy();
    };
  }, [animationData]);

  return (
    <div ref={container} style={{ width, height }}></div>
  );
}

export default LottieAnimation;
