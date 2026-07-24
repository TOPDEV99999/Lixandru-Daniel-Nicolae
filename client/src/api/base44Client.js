// Updated Base44 client that uses our local backend compatibility layer
// This provides a drop-in replacement for the original Base44 SDK

import compatibilityDB from './base44Compatibility.js';

export const db = compatibilityDB;
export const base44 = compatibilityDB;
export default compatibilityDB;