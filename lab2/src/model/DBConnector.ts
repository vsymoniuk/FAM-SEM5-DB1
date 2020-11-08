import { Pool, QueryResult } from "pg";

export class DBConnector {
  private static databasePool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shop',
    password: 'password',
    port: 5432,
  });

  public static query(query: string, queryValues: any [] = [] ): Promise<QueryResult<any>> {
    return DBConnector.databasePool.query(query, queryValues);
  }
}
