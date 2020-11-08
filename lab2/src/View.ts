import readlineSync from 'readline-sync';

export class View {

    public static printMainMenu(): void {
        console.clear();
        console.log("Main menu. Choose your options: ");
        console.log("1. Read list of entities");
        console.log("2. Read entity by ID");
        console.log("3. Create entity");
        console.log("4. Update entity");
        console.log("5. Delete entity");
        console.log("6. Some operation with joining tables");
        console.log("7. Generate random data");
        console.log("0. Exit");
    }

    public static printOptionsMenu(): void {
        console.clear();
        console.log("Choose an entity:");
        console.log("1. customer");
        console.log("2. coupon");
        console.log("3. order");
        console.log("4. product");
    }

    public static printJoinOptionsMenu(): void {
        console.clear();
        console.log("Choose an option with data, you want to get:");
        console.log("1. Get order customer name with discount and total sum");
        console.log("2. Get all orders by customer name");
    }

    public static readInteger(text: string): number {        
        return parseInt(readlineSync.question(text));
    }


    public static readFloat(text: string): number {
        return parseFloat(readlineSync.question(text));
    }

    public static readString(text: string): string {
        return readlineSync.question(text);
    }

    public static readDate(text: string): Date {
        return new Date(readlineSync.question(text));
    }

    public static readBoolean(text: string): boolean {
        return readlineSync.question(text) === "true" ? true : false;
    }

    public static printEntities(entities: any): void {
        console.table(entities);
    }

    public static printLine(text: string): void {
        console.log(text);
    }

    public static pressToReturn(): void {
        readlineSync.question("Press any key to return: ");
    }

}