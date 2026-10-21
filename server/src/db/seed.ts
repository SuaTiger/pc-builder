import { env } from '../config/env';
import { db, queryClient } from './client';
import { coolers, cpus, gpus, motherboards, partTables, pcCases, psus, ramKits, storageDrives } from './schema';
import {
  caseSeed,
  coolerSeed,
  cpuSeed,
  gpuSeed,
  motherboardSeed,
  psuSeed,
  ramSeed,
  storageSeed,
} from './seed-data';

/** Wipes every part table and refills it with sample data. Development only. */
async function seed() {
  if (env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed: NODE_ENV is production');
  }

  // One transaction: either everything is replaced or nothing changes.
  await db.transaction(async (tx) => {
    for (const table of Object.values(partTables)) {
      await tx.delete(table);
    }
    await tx.insert(cpus).values(cpuSeed);
    await tx.insert(motherboards).values(motherboardSeed);
    await tx.insert(ramKits).values(ramSeed);
    await tx.insert(gpus).values(gpuSeed);
    await tx.insert(storageDrives).values(storageSeed);
    await tx.insert(psus).values(psuSeed);
    await tx.insert(pcCases).values(caseSeed);
    await tx.insert(coolers).values(coolerSeed);
  });

  console.log('Seeded sample parts.');
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => queryClient.end());
