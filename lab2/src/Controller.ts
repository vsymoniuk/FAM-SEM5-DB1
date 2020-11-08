import { Customer } from "@models/Customer";
import { Product } from "@models/Product";
import { Coupon } from "@models/Coupon";
import { Order } from "@models/Order";
import { View } from "@view";

export class Controller {
  public async init(): Promise<void> {
    let currentMenuItem = -1;

    while (currentMenuItem !== 0) {
      View.printMainMenu();
      currentMenuItem = View.readInteger("Enter your choice: ");

      switch (currentMenuItem) {
        case 1: {
          await this.getAllEntities();
          break;
        }
        case 2: {
          await this.getEntityById();
          break;
        }
        case 3: {
          await this.createEntity();
          break;
        }
        case 4: {
          await this.updateEntity();
          break;
        }
        case 5: {
          await this.deleteEntity();
          break;
        }
        case 6: {
          await this.joinOperation();
          break;
        }
        case 7: {
          await this.generateRandomEntity();
          break;
        }
        case 0:
          return;
      }
    }
  }

  private async getAllEntities(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");

      switch (option) {
        case 1: {
          View.printEntities(await Customer.getAll());
          break;
        }
        case 2: {
          View.printEntities(await Coupon.getAll());
          break;
        }
        case 3: {
          View.printEntities(await Order.getAll());
          break;
        }
        case 4: {
          View.printEntities(await Product.getAll());
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async getEntityById(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");
      const id = View.readInteger("Enter id of the entity: ");

      switch (option) {
        case 1: {
          View.printEntities([await Customer.getById(id)]);
          break;
        }
        case 2: {
          View.printEntities([await Coupon.getById(id)]);
          break;
        }
        case 3: {
          View.printEntities([await Order.getById(id)]);
          break;
        }
        case 4: {
          View.printEntities([await Product.getById(id)]);
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async createEntity(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");

      switch (option) {
        case 1: {
          const name = View.readString("Enter name of the customer: ");
          const email = View.readString("Enter email of the customer: ");

          View.printEntities([await Customer.create(name, email)]);
          break;
        }
        case 2: {
          const value = View.readInteger("Enter the coupon discount value: ");

          View.printEntities([await Coupon.create(value)]);
          break;
        }
        case 3: {
          const coupon_id = View.readInteger("Enter the valid coupon_id: ");
          const customer_id = View.readInteger("Enter the valid customer_id: ");
          const products = View.readString(
            "Enter valid json string that describes products: "
          );
          const total = View.readInteger("Enter total cost of products: ");

          View.printEntities([
            await Order.create(coupon_id, customer_id, products, total),
          ]);
          break;
        }
        case 4: {
          const name = View.readString("Enter the name of the product: ");
          const cost = View.readInteger("Enter the cost of the product: ");
          const description = View.readString(
            "Enter the description of the product: "
          );

          View.printEntities([await Product.create(name, cost, description)]);
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async updateEntity(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");
      const id = View.readInteger("Enter id of the entity: ");

      switch (option) {
        case 1: {
          const name = View.readString("Enter name of the customer: ");
          const email = View.readString("Enter email of the customer: ");
          const newCustomer = { customer_id: id, name, email };

          await Customer.update(newCustomer);
          View.printEntities([newCustomer]);
          break;
        }
        case 2: {
          const value = View.readInteger("Enter the coupon discount value: ");

          View.printEntities([await Coupon.update({ coupon_id: id, value })]);
          break;
        }
        case 3: {
          const coupon_id = View.readInteger("Enter the valid coupon_id: ");
          const customer_id = View.readInteger("Enter the valid customer_id: ");
          const products = View.readString(
            "Enter valid json string that describes products: "
          );
          const total = View.readInteger("Enter total cost of products: ");

          View.printEntities([
            await Order.update({
              order_id: id,
              coupon_id,
              customer_id,
              products,
              total,
            }),
          ]);
          break;
        }
        case 4: {
          const name = View.readString("Enter the name of the product: ");
          const cost = View.readInteger("Enter the cost of the product: ");
          const description = View.readString(
            "Enter the description of the product: "
          );

          View.printEntities([
            await Product.update({
              product_id: id,
              name,
              cost,
              description,
            }),
          ]);
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async deleteEntity(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");
      const id = View.readInteger("Enter id of the entity: ");

      switch (option) {
        case 1: {
          await Customer.delete(id);
          View.printLine("Success");
          break;
        }
        case 2: {
          await Coupon.delete(id);
          View.printLine("Success");
          break;
        }
        case 3: {
          await Order.delete(id);
          View.printLine("Success");
          break;
        }
        case 4: {
            await Product.delete(id);
            View.printLine("Success");
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async generateRandomEntity(): Promise<void> {
    try {
      View.printOptionsMenu();
      const option = View.readInteger("Enter your choice: ");
      const entitiesCount = View.readInteger(
        "Enter how many entities you want to generate: "
      );

      switch (option) {
        case 1: {
          for (let i = 0; i < entitiesCount; i++) {
            View.printEntities([await Customer.generate()]);
          }

          break;
        }
        case 2: {
          for (let i = 0; i < entitiesCount; i++) {
            View.printEntities([await Coupon.generate()]);
          }

          break;
        }
        case 3: {
          for (let i = 0; i < entitiesCount; i++) {
            View.printEntities([await Order.generate()]);
          }

          break;
        }
        case 4: {
          for (let i = 0; i < entitiesCount; i++) {
            View.printEntities([await Product.generate()]);
          }

          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }

  private async joinOperation(): Promise<void> {
    try {
      View.printJoinOptionsMenu();
      const option = View.readInteger("Enter your choice: ");

      switch (option) {
        case 1: {
          View.printEntities(await Order.details());
          break;
        }
        case 2: {
          const name = View.readString("Enter customer name: ");
          View.printEntities(await Order.getByCustomerName(name));
          break;
        }
        default: {
          View.printLine("Wrong choice");
        }
      }
    } catch (error) {
      View.printLine(`Error: ${error.message}`);
    }

    View.pressToReturn();
  }
}
