import { DBConnector } from "@connector";

export class Customer {
  constructor(
    public customer_id: number,
    public name: string,
    public email: string
  ) {}

  public static async getById(entityId: number): Promise<Customer> {
    const query = `
        SELECT 
            customer_id, 
            name, 
            email 
        FROM public."customer" 
        WHERE public."customer".customer_id = $1`;
    const { rows } = await DBConnector.query(query, [entityId]);
    if (!rows.length) {
      throw Error("No entity with such id found");
    }
    const { customer_id, name, email } = rows[0];
    return new Customer(customer_id, name, email);
  }

  public static async getAll(): Promise<Customer[]> {
    const query = `
        SELECT 
            customer_id, 
            name, 
            email 
        FROM public."customer"`;
    const { rows } = await DBConnector.query(query);
    return rows.map((row) => {
      const { customer_id, name, email } = row;
      return new Customer(customer_id, name, email);
    });
  }

  public static async create(name: string, email: string): Promise<Customer> {
    const query = `
        INSERT INTO public."customer" (name, email) 
        VALUES ($1, $2) 
        RETURNING customer_id;`;
    const { rows } = await DBConnector.query(query, [name, email]);
    const { customer_id } = rows[0];
    return new Customer(customer_id, name, email);
  }

  public static async generate(): Promise<Customer> {
    const query = ` 
        INSERT INTO public."customer" (name, email) 
        VALUES (
            SUBSTRING( MD5 ( RANDOM()::text ), 1, 10 ),
            CONCAT( SUBSTRING( MD5 ( RANDOM()::text ), 1, 6 ), '@gmail.com')
        ) RETURNING customer_id, name, email;`;
    const { rows } = await DBConnector.query(query);
    const { customer_id, name, email } = rows[0];
    return new Customer(customer_id, name, email);
  }

  public static async update(customer: Customer): Promise<void> {
    const query = `
        UPDATE public."customer" 
        SET name = $2, email = $3
        WHERE public."customer".customer_id = $1`;
    const { customer_id, name, email } = customer;
    const { rowCount } = await DBConnector.query(query, [
      customer_id,
      name,
      email,
    ]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }

  public static async delete(id: number): Promise<void> {
    const query = `
        DELETE FROM public."customer" 
        WHERE public."customer".customer_id = $1;`;
    const { rowCount } = await DBConnector.query(query, [id]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }
}
