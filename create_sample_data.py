import pandas as pd
import os

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Create sample product data
data = {
    'product_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    'product_name': [
        'Laptop Pro', 'Wireless Mouse', 'Mechanical Keyboard', '4K Monitor', 'USB-C Cable',
        'Laptop Stand', 'Desk Lamp', 'Mouse Pad', 'USB Hub', 'Phone Stand',
        'Webcam HD', 'External SSD', 'Portable Speaker', 'HDMI Cable', 'Desk Organizer'
    ],
    'category': [
        'Electronics', 'Accessories', 'Electronics', 'Electronics', 'Accessories',
        'Accessories', 'Accessories', 'Accessories', 'Electronics', 'Accessories',
        'Electronics', 'Electronics', 'Audio', 'Cables', 'Office Supplies'
    ],
    'price': [999.99, 29.99, 79.99, 299.99, 19.99, 49.99, 39.99, 9.99, 24.99, 14.99, 89.99, 149.99, 59.99, 12.99, 34.99],
    'stock': [15, 150, 80, 20, 500, 75, 120, 200, 95, 180, 45, 30, 65, 300, 110],
    'description': [
        'High-performance laptop with RTX GPU', 'Wireless optical mouse with ergonomic design',
        'RGB mechanical keyboard with hot-swap switches', '4K IPS display monitor for professionals',
        '2m USB-C charging and data cable', 'Adjustable aluminum laptop stand',
        'LED desk lamp with USB charging', 'Large anti-slip mouse pad',
        '7-port USB 3.0 hub with power adapter', 'Adjustable phone stand for desk',
        'Full HD 1080p webcam with microphone', '1TB portable SSD storage',
        'Bluetooth portable speaker with 10h battery', '2m HDMI 2.1 cable',
        'Multi-compartment desk organizer'
    ]
}

df = pd.DataFrame(data)

# Save to Parquet
df.to_parquet('data/products.parquet', index=False)
print("✓ Created data/products.parquet with 15 sample products")