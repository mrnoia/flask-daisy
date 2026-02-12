from flask import Flask, render_template
from data_service import data_service

app = Flask(__name__)

@app.get("/")
def overview():
    return render_template("pages/overview.html")

@app.get("/dashboard-showcase")
def dashboard_showcase():
    return render_template("pages/home.html")

@app.get("/crud-showcase")
def crud_showcase():
    return render_template("pages/crud_showcase.html")

@app.get("/tutorial/layout-grid")
def tutorial_layout_grid():
    return render_template("pages/tutorial_layout_grid.html")

@app.get("/tutorial/typography")
def tutorial_typography():
    return render_template("pages/tutorial_typography.html")

@app.get("/tutorial/components")
def tutorial_components():
    return render_template("pages/tutorial_components.html")

@app.get("/tutorial/building-pages")
def tutorial_building_pages():
    return render_template("pages/tutorial_building_pages.html")

@app.get("/tutorial/connecting-data")
def tutorial_connecting_data():
    return render_template("pages/tutorial_connecting_data.html")

@app.get("/products")
def products():
    return render_template("pages/products.html")

@app.get("/analytics")
def analytics():
    """Data-driven analytics dashboard"""
    stats = data_service.get_product_stats()
    categories = data_service.get_category_stats()
    price_distribution = data_service.get_price_distribution()
    stock_distribution = data_service.get_stock_distribution()
    top_products = data_service.get_top_products_by_value()
    
    return render_template(
        "pages/analytics.html",
        stats=stats,
        categories=categories,
        price_distribution=price_distribution,
        stock_distribution=stock_distribution,
        top_products=top_products
    )

if __name__ == "__main__":
    app.run(debug=True)
