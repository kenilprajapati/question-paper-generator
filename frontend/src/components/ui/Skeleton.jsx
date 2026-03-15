import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ count = 1, height, width, circle = false, className = "" }) => {
  return (
    <div className={`skeleton-wrapper ${className}`}>
      <Skeleton 
        count={count} 
        height={height} 
        width={width} 
        circle={circle}
        baseColor="#e2e8f0"
        highlightColor="#f8fafc"
      />
    </div>
  );
};

export default SkeletonLoader;
