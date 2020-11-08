import { DBConnector } from "@connector";

export class Order {
  constructor(
    public order_id: number,
    public coupon_id: number,
    public customer_id: number,
    public products: string,
    public total: number
  ) {}

  public static async getById(entityId: number): Promise<Order> {
    const query = `
        SELECT 
            order_id, 
            coupon_id,
            customer_id,
            products, 
            total 
        FROM public."order" 
        WHERE public."order".order_id = $1`;
    const { rows } = await DBConnector.query(query, [entityId]);
    if (!rows.length) {
      throw Error("No entity with such id found");
    }
    const { order_id, coupon_id, customer_id, products, total } = rows[0];
    return new Order(order_id, coupon_id, customer_id, products, total);
  }

  public static async getAll(): Promise<Order[]> {
    const query = `
        SELECT 
            order_id, 
            coupon_id,
            customer_id,
            products, 
            total 
        FROM public."order"`;
    const { rows } = await DBConnector.query(query);
    return rows.map((row) => {
      const { order_id, coupon_id, customer_id, products, total } = row;
      return new Order(order_id, coupon_id, customer_id, products, total);
    });
  }

  public static async create(
    coupon_id: number,
    customer_id: number,
    products: string,
    total: number
  ): Promise<Order> {
    const query = `
        INSERT INTO public."order" (coupon_id,customer_id,products,total) 
        VALUES ($1, $2, $3, $4) 
        RETURNING order_id;`;
    const { rows } = await DBConnector.query(query, [
      coupon_id,
      customer_id,
      products,
      total,
    ]);
    const { order_id } = rows[0];
    return new Order(order_id, coupon_id, customer_id, products, total);
  }

  public static async generate(): Promise<Order> {
    const query = `
    INSERT INTO public."order" (coupon_id,customer_id,products,total) 
        VALUES (
            (	
				SELECT coupon_id FROM public."coupon"
				ORDER BY RANDOM()
				LIMIT 1
			),
			(
				SELECT customer_id FROM public."customer"
				ORDER BY RANDOM()
				LIMIT 1
			),
			CONCAT(
				'{"',
				SUBSTRING(MD5(RANDOM()::text),1,3),
				'":"',
				SUBSTRING(MD5(RANDOM()::text),1,5),
				'"}'
			), 
			( RANDOM() * 1000 )::integer
        ) RETURNING order_id,coupon_id,customer_id,products,total;
    `;
    const { rows } = await DBConnector.query(query);
    const { order_id, coupon_id, customer_id, products, total } = rows[0];
    return new Order(order_id, coupon_id, customer_id, products, total);
  }

  public static async update(order: Order): Promise<void> {
    const query = `
        UPDATE public."order" 
        SET coupon_id = $2, customer_id = $3, products = $4, total = $5
        WHERE public."order".order_id = $1`;
    const { order_id, coupon_id, customer_id, products, total } = order;
    const { rowCount } = await DBConnector.query(query, [
      order_id,
      coupon_id,
      customer_id,
      products,
      total,
    ]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }

  public static async delete(id: number): Promise<void> {
    const query = `
        DELETE FROM public."order" 
        WHERE public."order".order_id = $1;`;
    const { rowCount } = await DBConnector.query(query, [id]);
    if (!rowCount) {
      throw new Error("No entity with such id found");
    }
  }

  public static async details(): Promise<any[]> {
    const query = `
        SELECT  cu.name as customer_name, 
                co.value as discount_value,
                o.total as total_order_sum
        FROM   public."order" o
        JOIN   public."coupon" co USING (coupon_id)
        JOIN   public."customer" cu USING (customer_id)
        ORDER  BY o.total DESC, co.value DESC
    `;
    const { rows } = await DBConnector.query(query);
    return rows;
  }

  public static async getByCustomerName(name: string) {
    const query = `
        SELECT cu.name as customer_name,
	        order_id,
	        products,
	        total
        FROM public."order" o
        JOIN public."customer" cu USING (customer_id)
        WHERE cu.name LIKE $1
    `;
    const { rows } = await DBConnector.query(query, [name]);
    return rows;
  }
}
