import type { Transaction } from "postgres";
import { client } from "./client.ts";
import logger from "../logger.ts";

export async function transaction<T>(
  callback: (db: Transaction) => Promise<T>,
): Promise<T> {
  const name = callback.name ?? "Anonymous transaction";
  const transaction = await client.createTransaction(name);
  try {
    logger.debug(`Begin transaction "${name}"`);
    await transaction.begin();
    const result = await callback(transaction);
    logger.debug(`Commit transaction "${name}"`);
    await transaction.commit();
    return result;
  } catch (error) {
    try {
      logger.debug(`Rollback transaction "${name}"`);
      await transaction.rollback();
    } catch {
      /* ignore */
    }
    throw error;
  }
}

export type { Transaction };
