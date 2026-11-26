interface product {
    id:number;
    name:string;
    category:string;
    price:number;
    stock:number;
    isActive:boolean;
}

interface OderItem{
    productId:number;
    quantity:number;
}

const products:product[]=[
    {
        id:1,
        name:"gaming",
        category:"Computer",
        price:35000,
        stock:10,
        isActive:true
    },
    {
        id:2,
        name:"Desktop PC",
        category:"Computer",
        price:50000,
        stock:5,
        isActive:true
    },
    {
        id:3,
        name:"Mouse",
        category:"accessory",
        price:300,
        stock:20,
        isActive:true
    },
    {
        id:4,
        name:"Office Laptop",
        category:"Computer",
        price:45000,
        stock:10,
        isActive:true
    },
    {
        id:5,
        name:"Keyboard",
        category:"accessory",
        price:800,
        stock:30,
        isActive:true
    },
    {
        id:6,
        name:"USB",
        category:"accessory",
        price:300,
        stock:2,
        isActive:false
    },
    {
        id:7,
        name: "MOnitor 16 inch",
        category: "Monitor",
        price:20000,
        stock:20,
        isActive:true
    },
    {
        id:8,
        name:"Gaming Monitor",
        category:"Monitor",
        price:40000,
        stock:7,
        isActive:true
    }   
];

function getAvailableProducts(
    products:product[]
): product[] {
    return products.filter((product)=>{
        return product.isActive===true && product.stock>0 ;
    });
}

function applyDiscountByCategory(
    products:product[],
    category:string,
    discountPercent:number
): product[]{
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error("Invalid discount percentage")
    }
    return products.map((product)=> {
        if (product.category===category) {
            return {
                ...product,
                price:product.price * (1-discountPercent/100)
            };
        }
        return product;
    });
}


function calculateInventoryValue(
    products:product[]
):number {
    return products.reduce((total,product)=>{
        return total + (product.price*product.stock);
    },0);
}

function summarizeInventoryByCategory(
    products: product[]
):Record < string , number>{
    return products.reduce((summary ,product)=> {
        const category = product.category;
        const current = summary[category] ?? 0;
        summary[category]=
            current +(product.price * product.stock);
        return summary;
    }, {}as Record<string,number> );
}

const availableproduct = getAvailableProducts(products);
console.log("Available:",availableproduct);

const discountproduct = applyDiscountByCategory(
    products,
    "Computer",
    10
);

console.log("Discount Product :",discountproduct)

const inventoryValue=calculateInventoryValue(products);
console.log("Inventory Value :", inventoryValue)

const inventorysummary = summarizeInventoryByCategory(products);
console.log("Inventory by Category :",inventorysummary);

const summaryTotal = Object.values(inventorysummary).reduce(
    (total,value)=> total+value,
    0
);

console.log("Summary matches total:",summaryTotal===inventoryValue);

try {
    applyDiscountByCategory(products,"Computer",-10);
}   catch (error){
    console.log("Negative discount:", (error as Error).message);
}

try{
    applyDiscountByCategory(products,"Computer",150);
}   catch (error) {
    console.log("Discount over 100:",(error as Error).message);
}

function fetchProductById(
    id:number
): Promise<product>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const product = products.find((p)=> p.id === id);
            if (product){
                resolve(product);
            }else{
                reject(new Error(`Product ID ${id} not found`));
            }
        },1000);
    });
}

async function processCustomerOrder(
    items:OderItem[]
):Promise <void> {

    const successfulItem :{
        product:product;
        quantity:number;
        total:number;
    }[]=[];

    const failedItem :{
        item:OderItem;
        reason : string;
    }[]=[];

    for (const item of items){
        try{
            if(
                !Number.isInteger(item.quantity)||
                item.quantity <=0
            ){
                throw new Error("Quantity must de a positive integer");
            }
            const product = await fetchProductById(item.productId);

            if (product.stock <item.quantity){
                throw new Error(
                `Insufficient stock for ${product.name}`
                );
            }
            const total = product.price*item.quantity;

            successfulItem.push({
                product,
                quantity:item.quantity,
                total
            });
             
        }catch (error){
        
        const reason = 
        error instanceof Error
            ?error.message
            :"Unknown error";

        failedItem.push({
            item,
            reason
        });
        }
    }
    
console.log("\nSuccessful Item:");
successfulItem.forEach((item)=>{
    console.log(
        `${item.product.name}x ${item.quantity}=${item.total}Baht`
    );
});
console.log("\nFailed Item:");
failedItem.forEach((item)=>{
    console.log(
        `Product ID ${item.item.productId}: ${item.reason}`
    )
});
const grandTotal = successfulItem.reduce(
    (sum,item)=>sum +item.total,
    0
);

console.log("\nGrand Total:",grandTotal,"Bath");
}

async function runOderTests():Promise<void> {
    
    await processCustomerOrder([
        {productId:1 ,quantity:2},
        {productId:4 , quantity:3}
    ]);

    await processCustomerOrder([
        {productId:999 , quantity:1}
    ]);
    await processCustomerOrder([
        {productId:2 ,quantity:100}
    ]);

    await processCustomerOrder([
        {productId:1 ,quantity:0},
        {productId:1 ,quantity:-2}
    ]);

    await processCustomerOrder([
        {productId:1 , quantity:1},
        {productId:999, quantity:1},
        {productId:4 ,quantity:2}
    ])
}

runOderTests();
type OrderStatus = "PENDING"|"PAID"|"CANCELLED"
const orderStatus :OrderStatus = "PENDING"
console.log("Order Status:",orderStatus)
