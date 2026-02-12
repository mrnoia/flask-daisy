import duckdb
from typing import List, Dict

class DataService:
    """Service for querying data with DuckDB"""
    
    def __init__(self, data_path: str = "data"):
        self.data_path = data_path
    
    def get_all_products(self) -> List[Dict]:
        """Get all products"""
        query = f"""
            SELECT * FROM '{self.data_path}/products.parquet'
            ORDER BY product_name
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]
    
    def get_product_stats(self) -> Dict:
        """Get overall product statistics"""
        query = f"""
            SELECT 
                COUNT(*) as total_products,
                COUNT(DISTINCT category) as total_categories,
                AVG(price) as avg_price,
                MIN(price) as min_price,
                MAX(price) as max_price,
                SUM(stock) as total_stock
            FROM '{self.data_path}/products.parquet'
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        rows = result.fetchall()
        if rows:
            return dict(zip(columns, rows[0]))
        return {}
    
    def get_category_stats(self) -> List[Dict]:
        """Get statistics grouped by category"""
        query = f"""
            SELECT 
                category,
                COUNT(*) as product_count,
                AVG(price) as avg_price,
                SUM(stock) as total_stock,
                MIN(price) as min_price,
                MAX(price) as max_price
            FROM '{self.data_path}/products.parquet'
            GROUP BY category
            ORDER BY product_count DESC
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]
    
    def get_price_distribution(self) -> List[Dict]:
        """Get products grouped by price ranges"""
        query = f"""
            SELECT 
                CASE 
                    WHEN price < 50 THEN 'Under $50'
                    WHEN price < 100 THEN '$50-$100'
                    WHEN price < 500 THEN '$100-$500'
                    ELSE 'Over $500'
                END as price_range,
                COUNT(*) as count,
                AVG(price) as avg_price
            FROM '{self.data_path}/products.parquet'
            GROUP BY price_range
            ORDER BY avg_price
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]
    
    def get_stock_distribution(self) -> List[Dict]:
        """Get products grouped by stock levels"""
        query = f"""
            SELECT 
                CASE 
                    WHEN stock = 0 THEN 'Out of Stock'
                    WHEN stock < 25 THEN 'Low Stock'
                    WHEN stock < 100 THEN 'Medium Stock'
                    ELSE 'High Stock'
                END as stock_level,
                COUNT(*) as count,
                AVG(price) as avg_price
            FROM '{self.data_path}/products.parquet'
            GROUP BY stock_level
            ORDER BY count DESC
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]
    
    def get_top_products_by_value(self, limit: int = 10) -> List[Dict]:
        """Get top products by inventory value (price * stock)"""
        query = f"""
            SELECT 
                product_name,
                category,
                price,
                stock,
                (price * stock) as inventory_value
            FROM '{self.data_path}/products.parquet'
            ORDER BY inventory_value DESC
            LIMIT {limit}
        """
        result = duckdb.query(query)
        columns = [desc[0] for desc in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]

# Create a global instance
data_service = DataService()