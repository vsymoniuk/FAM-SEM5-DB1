import { DBConnector } from "@connector";

export class Product {
  constructor(
    public product_id: number,
    public name: string,
    public cost: number,
    public description: string
  ) {}

  public static async getById(entityId: number): Promise<Product> {
    const query = `
        SELECT 
            product_id, 
            name,
            cost,
            description
        FROM public."product" 
        WHERE public."product".product_id = $1`;
    const { rows } = await DBConnector.query(query, [entityId]);
    if (!rows.length) {
      throw Error("No entity with such id found");
    }
    const { product_id, name, cost, description } = rows[0];
    return new Product(product_id, name, cost, description);
  }

  public static async getAll(): Promise<Product[]> {
    const query = `
        SELECT 
            product_id, 
            name, 
            cost, 
            description 
        FROM public."product"`;
    const { rows } = await DBConnector.query(query);
    return rows.map((row) => {
      const { product_id, name, cost, description } = row;
      return new Product(product_id, name, cost, description);
    });
  }

  public static async create(
    name: string,
    cost: number,
    description: string
  ): Promise<Product> {
    const query = `
        INSERT INTO public."product" ( name, cost, description ) 
        VALUES ($1, $2, $3) 
        RETURNING product_id;`;
    const { rows } = await DBConnector.query(query, [name, cost, description]);
    const { product_id } = rows[0];
    return new Product(product_id, name, cost, description);
  }

  public static async generate(): Promise<Product> {
    const query = `
    INSERT INTO public."product" ( name, cost, description ) 
        VALUES (
            SUBSTRING(MD5(RANDOM()::text),1,10),
            ( RANDOM() * 1000 )::integer,
            SUBSTRING(MD5(RANDOM()::text),1,25),
        ) RETURNING product_id,name,cost,description;
    `;
    const { rows } = await DBConnector.query(query);
    const { product_id, name, cost, description } = rows[0];
    return new Product(product_id, name, cost, description);
  }

  public static async update(product: Product): Promise<void> {
    const query = `
        UPDATE public."product" 
        SET name = $2, cost = $3, description = $4
        WHERE public."product".product_id = $1`;
    const { product_id, name, cost, description } = product;
    const { rowCount } = await DBConnector.query(query, [
      product_id,
      name,
      cost,
      description,
    ]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }

  public static async delete(id: number): Promise<void> {
    const query = `
        DELETE FROM public."product" 
        WHERE public."product".product_id = $1;`;
    const { rowCount } = await DBConnector.query(query, [id]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }
}
