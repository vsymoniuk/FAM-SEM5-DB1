import { DBConnector } from "@connector";

export class Coupon {
  constructor(
    public coupon_id: number,
    public value: number,
  ) {}

  public static async getById(entityId: number): Promise<Coupon> {
    const query = `
        SELECT 
            coupon_id, 
            value 
        FROM public."coupon" 
        WHERE public."coupon".coupon_id = $1`;
    const { rows } = await DBConnector.query(query, [entityId]);
    if (!rows.length) {
      throw Error("No entity with such id found");
    }
    const { coupon_id, value } = rows[0];
    return new Coupon(coupon_id,value);
  }

  public static async getAll(): Promise<Coupon[]> {
    const query = `
        SELECT 
            coupon_id, 
            value
        FROM public."coupon"`;
    const { rows } = await DBConnector.query(query);
    return rows.map((row) => {
      const { coupon_id, value } = row;
      return new Coupon(coupon_id, value);
    });
  }

  public static async create(value: number): Promise<Coupon> {
    const query = `
        INSERT INTO public."coupon" (value) 
        VALUES ($1) 
        RETURNING coupon_id;`;
    const { rows } = await DBConnector.query(query, [value]);
    const { coupon_id } = rows[0];
    return new Coupon(coupon_id, value);
  }

  public static async generate(): Promise<Coupon> {
    const query = ` 
        INSERT INTO public."coupon" (value) 
        VALUES (
            ( RANDOM() * (100 - 10 + 1) + 10 )::integer
        ) RETURNING coupon_id, value;`;
    const { rows } = await DBConnector.query(query);
    const { coupon_id, value } = rows[0];
    return new Coupon(coupon_id, value);
  }

  public static async update(coupon: Coupon): Promise<void> {
    const query = `
        UPDATE public."coupon" 
        SET value = $2
        WHERE public."coupon".coupon_id = $1`;
    const { coupon_id, value } = coupon;
    const { rowCount } = await DBConnector.query(query, [
      coupon_id,
      value
    ]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }

  public static async delete(id: number): Promise<void> {
    const query = `
        DELETE FROM public."coupon" 
        WHERE public."coupon".coupon_id = $1;`;
    const { rowCount } = await DBConnector.query(query, [id]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }
}
