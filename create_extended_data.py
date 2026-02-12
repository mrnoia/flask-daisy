import pandas as pd
import os
import random

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Extended product data with 100+ records
product_names = [
    'Laptop Pro', 'Wireless Mouse', 'Mechanical Keyboard', '4K Monitor', 'USB-C Cable',
    'Laptop Stand', 'Desk Lamp', 'Mouse Pad', 'USB Hub', 'Phone Stand',
    'Webcam HD', 'External SSD', 'Portable Speaker', 'HDMI Cable', 'Desk Organizer',
    'Wireless Charger', 'Monitor Arm', 'Desk Mat', 'USB-A Hub', 'Screen Protector',
    'Keyboard Switch Puller', 'Cable Organizer', 'Desktop Fan', 'LED Strip', 'Microphone Stand',
    'Pop Filter', 'XLR Cable', 'Audio Interface', 'Studio Monitor', 'Headphone Stand',
    'Cooling Pad', 'Power Bank', 'USB Splitter', 'Card Reader', 'Docking Station',
    'USB-C Adapter', 'HDMI Splitter', 'Network Cable', 'Surge Protector', 'Extension Cord',
    'Desk Pad', 'Monitor Light Bar', 'Keyboard Stabilizer', 'Keycap Set', 'Switch Tester',
    'Cable Sleeve', 'Clip Lamp', 'Ring Light', 'Tripod', 'Phone Clip',
    'Tablet Stand', 'Monitor Stand', 'Desk Riser', 'Footrest', 'Back Cushion',
    'Wrist Rest', 'Mouse Bungee', 'Cable Box', 'Drawer Organizer', 'File Organizer'
]

categories = [
    'Electronics', 'Accessories', 'Audio', 'Cables', 'Office Supplies',
    'Lighting', 'Furniture', 'Peripherals', 'Storage', 'Networking'
]

# Generate 150 products
data = {
    'product_id': list(range(1, 151)),
    'product_name': [random.choice(product_names) for _ in range(150)],
    'category': [random.choice(categories) for _ in range(150)],
    'price': [round(random.uniform(9.99, 999.99), 2) for _ in range(150)],
    'stock': [random.randint(0, 500) for _ in range(150)],
    'sku': [f"SKU-{str(i).zfill(5)}" for i in range(1, 151)],
    'supplier': [random.choice(['TechCorp', 'ElectroSupply', 'GlobalTrade', 'DirectImport', 'ProVendor']) for _ in range(150)],
    'last_updated': [f"2025-{random.randint(1,12):02d}-{random.randint(1,28):02d}" for _ in range(150)],
    'status': [random.choice(['Active', 'Inactive', 'Discontinued']) for _ in range(150)],
}

df = pd.DataFrame(data)

# Save to Parquet
df.to_parquet('data/products.parquet', index=False)
print("✓ Created data/products.parquet with 150 products")