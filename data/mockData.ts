import type { Region, Store, Supplier, Product, Sale, ItTicket, ItTicketStatus, Order, Forecast, PosTransaction } from '../types';

const REGIONS: Region[] = ['North', 'South', 'East', 'West'];
const SUPPLIERS_LIST = ['Fresh Produce Inc.', 'Dairy National', 'Organic Farms Co.', 'Global Fruit Importers', 'Bakery Delights'];
const PRODUCT_LIST = [
    { name: 'Organic Bananas', category: 'Fruits', supplier: 'Fresh Produce Inc.', unit: 'Lbs', price: 0.79 },
    { name: 'Local Strawberries', category: 'Fruits', supplier: 'Organic Farms Co.', unit: 'Cases', price: 24.99 },
    { name: 'Hass Avocados', category: 'Fruits', supplier: 'Global Fruit Importers', unit: 'Cases', price: 35.50 },
    { name: 'Romaine Lettuce', category: 'Vegetables', supplier: 'Fresh Produce Inc.', unit: 'Heads', price: 1.99 },
    { name: 'Whole Milk', category: 'Dairy', supplier: 'Dairy National', unit: 'Gallons', price: 4.29 },
    { name: 'Sourdough Bread', category: 'Bakery', supplier: 'Bakery Delights', unit: 'Loaves', price: 5.49 },
    { name: 'Free-Range Eggs', category: 'Dairy', supplier: 'Organic Farms Co.', unit: 'Dozens', price: 6.99 },
    { name: 'Cherry Tomatoes', category: 'Vegetables', supplier: 'Organic Farms Co.', unit: 'Pints', price: 3.49 },
];

const IT_TICKET_SUBJECTS = [
    { subject: 'Cannot connect to shared network drive', requester: 'Alice Johnson' },
    { subject: 'Printer in marketing is not working', requester: 'Bob Williams' },
    { subject: 'Request for new software installation (Adobe)', requester: 'Charlie Brown' },
    { subject: 'Email client keeps crashing', requester: 'Grace Lee' },
    { subject: 'VPN access issues from home', requester: 'Henry Scott' },
    { subject: 'Slow computer performance', requester: 'Ivy Green' },
    { subject: 'Laptop battery replacement for sales team', requester: 'Diana Prince' },
    { subject: 'ERP System login issues after update', requester: 'Edward Nygma' },
    { subject: 'Onboarding new hire hardware setup', requester: 'Jack King' },
    { subject: 'Password reset for new employee', requester: 'Frank Castle' },
    { subject: 'Monitor replacement for graphics department', requester: 'Karen Page' },
    { subject: 'Wi-Fi connectivity problem in conference room', requester: 'Luke Cage' },
];

// Fix: Explicitly type the `region` property to match the `Region` type.
// This resolves the TypeScript error where a generic `string` was not assignable to the specific `Region` union type.
const STORE_LOCATIONS: { city: string; area: string; region: Region }[] = [
    { city: 'New York', area: 'Midtown', region: 'East' },
    { city: 'Los Angeles', area: 'Downtown', region: 'West' },
    { city: 'Chicago', area: 'River North', region: 'North' },
    { city: 'Houston', area: 'Galleria', region: 'South' },
    { city: 'Phoenix', area: 'Camelback', region: 'West' },
    { city: 'Philadelphia', area: 'Center City', region: 'East' },
    { city: 'San Antonio', area: 'Riverwalk', region: 'South' },
    { city: 'San Diego', area: 'Gaslamp', region: 'West' },
    { city: 'Dallas', area: 'Uptown', region: 'South' },
    { city: 'San Jose', area: 'Willow Glen', region: 'West' },
    { city: 'Austin', area: 'South Congress', region: 'South' },
    { city: 'Jacksonville', area: 'Riverside', region: 'South' },
    { city: 'Fort Worth', area: 'Sundance Square', region: 'South' },
    { city: 'Columbus', area: 'Short North', region: 'North' },
    { city: 'Charlotte', area: 'South End', region: 'East' },
    { city: 'San Francisco', area: 'SOMA', region: 'West' },
    { city: 'Indianapolis', area: 'Broad Ripple', region: 'North' },
    { city: 'Seattle', area: 'Capitol Hill', region: 'West' },
    { city: 'Denver', area: 'LoDo', region: 'West' },
    { city: 'Washington', area: 'Georgetown', region: 'East' },
    { city: 'Boston', area: 'Back Bay', region: 'East' },
    { city: 'Detroit', area: 'Midtown', region: 'North' },
    { city: 'Nashville', area: 'The Gulch', region: 'South' },
    { city: 'Portland', area: 'Pearl District', region: 'West' },
    { city: 'Memphis', area: 'East Memphis', region: 'South' },
    { city: 'Oklahoma City', area: 'Bricktown', region: 'South' },
    { city: 'Las Vegas', area: 'Summerlin', region: 'West' },
    { city: 'Louisville', area: 'Highlands', region: 'South' },
    { city: 'Baltimore', area: 'Inner Harbor', region: 'East' },
    { city: 'Milwaukee', area: 'Third Ward', region: 'North' },
    { city: 'Albuquerque', area: 'Nob Hill', region: 'West' },
    { city: 'Tucson', area: 'Catalina Foothills', region: 'West' },
    { city: 'Fresno', area: 'Tower District', region: 'West' },
    { city: 'Sacramento', area: 'Midtown', region: 'West' },
    { city: 'Kansas City', area: 'Plaza', region: 'North' },
    { city: 'Atlanta', area: 'Midtown', region: 'South' },
    { city: 'Miami', area: 'South Beach', region: 'South' },
    { city: 'Raleigh', area: 'North Hills', region: 'East' },
    { city: 'Minneapolis', area: 'North Loop', region: 'North' },
    { city: 'Tampa', area: 'Hyde Park', region: 'South' },
];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// --- GENERATED DATA ---

export const REGIONS_DATA: Region[] = REGIONS;
export const SUPPLIERS_DATA: Supplier[] = SUPPLIERS_LIST.map((name, i) => ({ id: i + 1, name }));

export const STORES_DATA: Store[] = Array.from({ length: 300 }, (_, i) => {
    const location = STORE_LOCATIONS[i % STORE_LOCATIONS.length];
    return {
        id: i + 1,
        name: `${location.city}_${location.area}_GG`,
        region: location.region,
    };
});

export const PRODUCTS_DATA: Product[] = PRODUCT_LIST.map((p, i) => ({
    id: i + 1,
    name: p.name,
    category: p.category,
    supplier: p.supplier,
    unit: p.unit,
    current_stock: randomInt(10, 100),
    forecast_rec: randomInt(50, 150),
    spoilage_rate: Number((Math.random() * 15 + 5).toFixed(1)),
}));

// DEPRECATED in favor of POS_TRANSACTIONS_DATA for KPI calculations
export const SALES_DATA: Sale[] = Array.from({ length: 15000 }, (_, i) => {
    const saleDate = randomDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    const quantity = randomInt(1, 20);
    const revenue = Number((quantity * Math.random() * 5 + 2).toFixed(2));
    const spoiled_quantity = Math.random() < 0.05 ? randomInt(1, 3) : 0; // 5% chance of spoilage
    return {
        id: i + 1,
        storeId: randomInt(1, 300),
        productId: randomInt(1, PRODUCTS_DATA.length),
        date: saleDate.toISOString().split('T')[0],
        quantity,
        revenue,
        spoiled_quantity,
    };
});

export const IT_TICKETS_DATA: ItTicket[] = Array.from({ length: 30 }, (_, i) => {
    const ticketDate = randomDate(new Date(new Date().setDate(new Date().getDate() - 30)), new Date());
    const statusRoll = Math.random();
    let status: ItTicketStatus = 'Completed';
    if (statusRoll > 0.9) status = 'Open';
    else if (statusRoll > 0.7) status = 'In Progress';
    
    const template = IT_TICKET_SUBJECTS[i % IT_TICKET_SUBJECTS.length];

    return {
        id: `T-2024-${String(i+1).padStart(3, '0')}`,
        subject: template.subject,
        requester: template.requester,
        date: ticketDate.toISOString().split('T')[0],
        status: status,
    }
});

export const PAST_ORDERS_DATA: Order[] = [
    { id: 'ORD-001', productName: 'Organic Bananas', supplier: 'Fresh Produce Inc.', quantity: 50, unit: 'Lbs', date: '2024-07-20', status: 'Approved', placedBy: 'John Doe' },
    { id: 'ORD-002', productName: 'Whole Milk', supplier: 'Dairy National', quantity: 100, unit: 'Gallons', date: '2024-07-20', status: 'Placed', placedBy: 'Store Manager' },
    { id: 'ORD-003', productName: 'Local Strawberries', supplier: 'Organic Farms Co.', quantity: 20, unit: 'Cases', date: '2024-07-19', status: 'Approved', placedBy: 'Jane Smith' },
    { id: 'ORD-004', productName: 'Sourdough Bread', supplier: 'Bakery Delights', quantity: 30, unit: 'Loaves', date: '2024-07-19', status: 'Placed', placedBy: 'Store Manager' },
    { id: 'ORD-005', productName: 'Hass Avocados', supplier: 'Global Fruit Importers', quantity: 15, unit: 'Cases', date: '2024-07-18', status: 'Approved', placedBy: 'John Doe' },
    { id: 'ORD-006', productName: 'Romaine Lettuce', supplier: 'Fresh Produce Inc.', quantity: 40, unit: 'Heads', date: '2024-07-18', status: 'Rejected', placedBy: 'Jane Smith' },
    { id: 'ORD-007', productName: 'Free-Range Eggs', supplier: 'Organic Farms Co.', quantity: 60, unit: 'Dozens', date: '2024-07-17', status: 'Placed', placedBy: 'Store Manager' },
    { id: 'ORD-008', productName: 'Cherry Tomatoes', supplier: 'Organic Farms Co.', quantity: 25, unit: 'Pints', date: '2024-07-16', status: 'Approved', placedBy: 'John Doe' },
    { id: 'ORD-009', productName: 'Organic Bananas', supplier: 'Fresh Produce Inc.', quantity: 45, unit: 'Lbs', date: '2024-07-15', status: 'Placed', placedBy: 'Store Manager' },
    { id: 'ORD-010', productName: 'Whole Milk', supplier: 'Dairy National', quantity: 90, unit: 'Gallons', date: '2024-07-15', status: 'Approved', placedBy: 'Jane Smith' },
];

export const FORECAST_DATA: Forecast[] = PRODUCTS_DATA.map(p => {
    const forecastedSales = randomInt(p.forecast_rec - 20, p.forecast_rec + 50);
    const confidenceRoll = Math.random();
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    if (confidenceRoll > 0.7) confidence = 'High';
    else if (confidenceRoll < 0.3) confidence = 'Low';

    return {
        productId: p.id,
        productName: p.name,
        category: p.category,
        forecastedSalesUnits: forecastedSales,
        unit: p.unit,
        expectedRevenue: forecastedSales * randomInt(3, 8),
        confidence,
        expectedSpoilageReduction: Number((Math.random() * 25 + 10).toFixed(1)), // e.g. 10.0 to 35.0 %
    }
});

export const POS_TRANSACTIONS_DATA: PosTransaction[] = Array.from({ length: 50000 }, (_, i) => {
    const timestamp = randomDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    const numItems = randomInt(1, 5);
    const items = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
        const productIndex = randomInt(0, PRODUCT_LIST.length - 1);
        const product = PRODUCT_LIST[productIndex];
        const quantity = randomInt(1, 3);
        const price = product.price;
        items.push({
            productId: productIndex + 1,
            quantity,
            price
        });
        totalAmount += quantity * price;
    }

    const paymentMethods: PosTransaction['paymentMethod'][] = ['Credit Card', 'Debit Card', 'Cash', 'Mobile'];

    return {
        transactionId: `TRX-${timestamp.getFullYear()}${String(timestamp.getMonth()+1).padStart(2, '0')}-${String(i+1).padStart(6, '0')}`,
        storeId: randomInt(1, STORES_DATA.length),
        timestamp: timestamp.toISOString(),
        items,
        totalAmount: Number(totalAmount.toFixed(2)),
        paymentMethod: paymentMethods[randomInt(0, paymentMethods.length - 1)]
    };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());