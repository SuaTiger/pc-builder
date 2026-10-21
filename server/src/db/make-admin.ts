import { eq, sql } from 'drizzle-orm';
import { db, queryClient } from './client';
import { profiles } from './schema';

/**
 * Promotes one user to admin: npm run db:make-admin -w server -- you@example.com
 * The person must have logged in at least once, because that is when their profile is created.
 */
async function makeAdmin(email: string) {
  const updated = await db
    .update(profiles)
    .set({ role: 'admin' })
    .where(eq(sql`lower(${profiles.email})`, email.toLowerCase()))
    .returning({ id: profiles.id });

  if (updated.length === 0) {
    throw new Error(`No profile with email ${email}. Log in once first; the profile is created then.`);
  }
  console.log(`${email} is now an admin.`);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run db:make-admin -w server -- you@example.com');
  process.exit(1);
}

makeAdmin(email)
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => queryClient.end());
