// The desks and the floors. Re-exported by world.mjs.
// A person's desk, on the organisation's premises.
export const DESK = { x: -492, y: -196, w: 120, d: 56, top: 40, t: 3 };
export const MONITOR = { x: -477, y: -180, w: 90, h: 58, d: 4, z: DESK.top + DESK.t + 9 };
// A third-party provider, outside the organisation, on a floor of its own
// touching the installation's, so the cable to it lies on the ground.
export const PROVIDER = { x: -320, y: 236, w: 120, d: 56, top: 40, t: 3 };

// Floors: the installation's room, the organisation's premises, the
// provider's, AWS and another site, each touching the room's.
export const FLOOR_H = 7;
export const ROOM_RING = [
  [-356, -296],
  [380, -296],
  [380, 140],
  [320, 200],
  [-356, 200],
];
export const ORG_RING = [
  [-516, -236],
  [-356, -236],
  [-356, 172],
  [-444, 172],
  [-516, 100],
];
export const PROV_RING = [
  [-340, 200],
  [-176, 200],
  [-176, 344],
  [-340, 344],
];
export const AWS_RING = [
  [140, -400],
  [400, -400],
  [400, -296],
  [140, -296],
];
export const SITE_RING = [
  [380, -80],
  [600, -80],
  [600, 80],
  [380, 80],
];
