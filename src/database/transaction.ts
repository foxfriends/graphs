import type { Transaction } from "../deps/postgres.ts";
import { client } from "./client.ts";

export async function transaction<T>(
  callback: (db: Transaction) => Promise<T>,
): Promise<T> {
  const transaction = await client.createTransaction(callback.name);
  try {
    await transaction.begin();
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export type { Transaction };
