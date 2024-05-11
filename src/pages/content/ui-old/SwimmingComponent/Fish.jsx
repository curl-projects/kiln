import React, { useEffect, useRef, useState } from 'react';

const Fish = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [koi, setKoi] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const { current: canvas } = canvasRef;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    class Koi {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.s = 0.5;
        this.a = 0;
        this.A = 0;
        this.c0 = Math.random() * 360;
        this.c1 = `hsl(${this.c0}, 100%, 50%)`;
        this.c2 = `hsl(${this.c0 + 50}, 100%, 50%)`;
      }

      draw(context) {
        this.update();
        this.a += Math.hypot(this.vx, this.vy) / 20;
        const An = Math.sin(this.a);
        const k = [
          50, 15 + An * 5, -20, 30 + An * 5, 20, 50 + An * 5, 50, 15 + An * 5,
          50, -15 + An * 5, -20, -30 + An * 5, 20, -50 + An * 5, 50, -15 + An * 5,
          100, 0, 100, -40, 0, -10, -100, 0 + An * 30, 0, 10, 100, 40, 100, 0,
          90, -6, 90, 6, 70, 0, -0, -0, -95, 0 + An * 30, -130, 0 + An * 40,
          -110, -0 + An * 30, -150, 0 + An * 30, -70, -0 + An * 30, -130, 0 + An * 40
        ];
        const p = [];
        for (let i = 0; i < k.length; i += 2) {
          p.push((k[i] * Math.cos(this.A) - k[i + 1] * Math.sin(this.A)) * this.s + this.x);
          p.push((k[i] * Math.sin(this.A) + k[i + 1] * Math.cos(this.A)) * this.s + this.y);
        }

        // Drawing the body of the fish
        context.beginPath();
        context.fillStyle = this.c2;
        context.moveTo(p[0], p[1]);
        context.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
        context.fill();

        // Draw other body parts for a complete fish
        context.beginPath();
        context.fillStyle = this.c1;
        context.moveTo(p[8], p[9]);
        context.bezierCurveTo(p[10], p[11], p[12], p[13], p[14], p[15]);
        context.fill();

        // Drawing the eyes
        context.beginPath();
        context.fillStyle = 'black';
        context.arc(p[30], p[31], 1, 0, Math.PI * 2);
        context.arc(p[32], p[33], 1, 0, Math.PI * 2);
        context.fill();
      }

      update() {
        if (target) {
          // Move towards the target position
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 1) {
            this.vx += (dx / distance) * 0.02;
            this.vy += (dy / distance) * 0.02;
          } else {
            // Reset the target when the fish reaches it
            setTarget(null);
          }
        } else {
          // Swim randomly with a slight tendency to turn
          this.vx += (Math.random() - 0.5) * 0.05;
          this.vy += (Math.random() - 0.5) * 0.05;
          this.vx += (Math.random() - 0.5) * 0.01 * this.vy;
          this.vy += (Math.random() - 0.5) * 0.01 * this.vx;
        }

        // Apply velocity and friction
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.x += this.vx;
        this.y += this.vy;

        // Update the fish's facing direction
        this.A = Math.atan2(this.vy, this.vx);

        // Wrap-around screen boundaries
        if (this.x > width + 100) this.x = -100;
        if (this.x < -100) this.x = width + 100;
        if (this.y > height + 100) this.y = -100;
        if (this.y < -100) this.y = height + 100;
      }
    }

    // Initialize koi fish
    if (koi.length === 0) {
      const initialKoi = [];
      for (let i = 0; i < 50; i++) {
        initialKoi.push(new Koi());
      }
      setKoi(initialKoi);
    }

    const drawLoop = () => {
      // Clear with a trail effect
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fillRect(0, 0, width, height);

      // Draw each fish
      koi.forEach(fish => fish.draw(context));

      requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => cancelAnimationFrame(drawLoop);
  }, [koi, width, height, target]);

  const handleMouseClick = event => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    setTarget(clickPosition);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleMouseClick}
      style={{ background: 'black', width: '100%', height: '100%' }}
    />
  );
};

export default Fish;