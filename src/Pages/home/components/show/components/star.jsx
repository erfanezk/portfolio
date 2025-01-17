import { useFrame } from '@react-three/fiber';
import React, { memo, useCallback, useRef } from 'react';
import * as THREE from 'three';

const current = {
  redialSegment: 5,
  tubularSegment: 88,
  tube: 1,
  radius: 6,
  arc: 19,
};
const SALE = {
  redialSegment: 5,
  tubularSegment: 88,
  tube: 1,
  radius: 6,
  arc: 19,
};
const GOAL = {
  redialSegment: 10,
  tubularSegment: 25,
  tube: 2,
  radius: 13,
  arc: 21,
};

const connection = 0.03;

const increaseToGoal = ({ complete, changed, RoundRef }) => {
  let con = true;
  complete.current = false;
  if (current.arc < GOAL.arc) {
    current.arc += connection;
    con = false;
  }
  if (current.radius < GOAL.radius) {
    current.radius += connection;
    con = false;
  }
  if (current.redialSegment < GOAL.redialSegment) {
    current.redialSegment += connection;
    con = false;
  }
  if (current.tubularSegment > GOAL.tubularSegment) {
    current.tubularSegment -= connection;
    con = false;
  }
  if (current.tube < GOAL.tube) {
    current.tube += connection;
    con = false;
  }
  if (con) {
    complete.current = true;
    changed.current = true;
  }
  const newGeo = new THREE.TorusBufferGeometry(
    current.radius,
    current.tube,
    current.tubularSegment,
    current.redialSegment,
    current.arc
  );
  if (RoundRef.current) {
    RoundRef.current.geometry.dispose();
    RoundRef.current.geometry = newGeo;
  }
};

const decreaseToGoal = ({ complete, changed, RoundRef }) => {
  let con = true;
  complete.current = false;
  if (current.radius > SALE.radius) {
    current.radius -= connection;
    con = false;
  }
  if (current.redialSegment > SALE.redialSegment) {
    current.redialSegment -= connection;
    con = false;
  }
  if (current.tube > SALE.tube) {
    current.tube -= connection;
    con = false;
  }
  if (current.tubularSegment < SALE.tubularSegment) {
    current.tubularSegment += connection;
    con = false;
  }
  if (current.arc > SALE.arc) {
    current.arc -= connection;
    con = false;
  }
  if (con) {
    changed.current = false;
    complete.current = true;
  }
  const newGeo = new THREE.TorusBufferGeometry(
    current.radius,
    current.tube,
    current.tubularSegment,
    current.redialSegment,
    current.arc
  );
  if (RoundRef.current) {
    RoundRef.current.geometry.dispose();
    RoundRef.current.geometry = newGeo;
  }
};

const Star = ({ position, speed, scale, direction, isHovered, texture }) => {
  const RoundRef = useRef(null);
  const parentRef = useRef(null);

  const changed = useRef(false);
  const complete = useRef(false);

  const rotateStar = useCallback(() => {
    RoundRef.current.rotation.y += direction * speed.y;
    RoundRef.current.rotation.z += direction * speed.z;
    RoundRef.current.rotation.x += direction * speed.x;
    parentRef.current.rotation.y += direction * speed.parent;
  }, [direction, speed]);

  useFrame((state, delta) => {
    if (isHovered) {
      if (!changed.current || !complete.current) {
        increaseToGoal({ complete, changed, RoundRef });
      }
    } else {
      if (changed.current || !complete.current) {
        decreaseToGoal({ complete, changed, RoundRef });
      }
    }

    rotateStar();
  });

  return (
    <mesh ref={parentRef}>
      <object3D>
        <mesh scale={[scale, scale, scale]} position={position} ref={RoundRef}>
          <torusBufferGeometry args={[6, 1, 88, 5, 19]} />
          <meshStandardMaterial needsUpdate map={texture} />
        </mesh>
      </object3D>
    </mesh>
  );
};

export default memo(Star);
