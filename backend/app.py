import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, init_database
from models import Item
from datetime import datetime

app = Flask(__name__)

# Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

# Initialize database
init_database(app)

# Enable CORS for frontend dev server
CORS(app)

# ============================================
# UTILITY FUNCTIONS
# ============================================

def success_response(data=None, message="Success", status_code=200):
    """Return a success JSON response"""
    response = {
        'success': True,
        'message': message,
        'data': data
    }
    return jsonify(response), status_code

def error_response(error, message="An error occurred", status_code=400):
    """Return an error JSON response"""
    response = {
        'success': False,
        'error': error,
        'message': message
    }
    return jsonify(response), status_code

# ============================================
# ROUTES
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return success_response({'status': 'healthy'}, 'API is running')

@app.route('/items', methods=['GET'])
def get_items():
    """Get all items"""
    try:
        items = Item.query.all()
        items_data = [item.to_dict() for item in items]
        return success_response(items_data, f"Retrieved {len(items_data)} items")
    except Exception as e:
        return error_response(str(e), "Failed to retrieve items", 500)

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Get a single item by ID"""
    try:
        item = Item.query.get(item_id)
        if not item:
            return error_response("Item not found", "The requested item does not exist", 404)
        return success_response(item.to_dict(), "Item retrieved successfully")
    except Exception as e:
        return error_response(str(e), "Failed to retrieve item", 500)

@app.route('/items', methods=['POST'])
def create_item():
    """Create a new item"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return error_response("No data provided", "Request body cannot be empty", 400)
        
        name = data.get('name', '').strip()
        if not name:
            return error_response("Validation error", "Item name is required", 400)
        
        price = data.get('price', 0.0)
        try:
            price = float(price)
            if price < 0:
                return error_response("Validation error", "Price must be >= 0", 400)
        except (ValueError, TypeError):
            return error_response("Validation error", "Price must be a valid number", 400)
        
        # Create new item
        new_item = Item(
            name=name,
            description=data.get('description', '').strip(),
            category=data.get('category', 'General'),
            price=price
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        return success_response(new_item.to_dict(), "Item created successfully", 201)
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), "Failed to create item", 500)

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """Update an existing item"""
    try:
        item = Item.query.get(item_id)
        if not item:
            return error_response("Item not found", "The requested item does not exist", 404)
        
        data = request.get_json()
        if not data:
            return error_response("No data provided", "Request body cannot be empty", 400)
        
        # Update fields if provided
        if 'name' in data:
            name = data['name'].strip()
            if not name:
                return error_response("Validation error", "Item name cannot be empty", 400)
            item.name = name
        
        if 'description' in data:
            item.description = data['description'].strip()
        
        if 'category' in data:
            item.category = data['category']
        
        if 'price' in data:
            try:
                price = float(data['price'])
                if price < 0:
                    return error_response("Validation error", "Price must be >= 0", 400)
                item.price = price
            except (ValueError, TypeError):
                return error_response("Validation error", "Price must be a valid number", 400)
        
        item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(item.to_dict(), "Item updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), "Failed to update item", 500)

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Delete an item"""
    try:
        item = Item.query.get(item_id)
        if not item:
            return error_response("Item not found", "The requested item does not exist", 404)
        
        db.session.delete(item)
        db.session.commit()
        
        return success_response({'id': item_id}, "Item deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response(str(e), "Failed to delete item", 500)

@app.route('/items/search', methods=['GET'])
def search_items():
    """Search items by name or description"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            items = Item.query.all()
        else:
            items = Item.query.filter(
                (Item.name.ilike(f'%{query}%')) | 
                (Item.description.ilike(f'%{query}%'))
            ).all()
        
        items_data = [item.to_dict() for item in items]
        return success_response(items_data, f"Found {len(items_data)} items matching '{query}'")
    except Exception as e:
        return error_response(str(e), "Failed to search items", 500)

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return error_response("Not Found", "The requested resource does not exist", 404)

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return error_response("Internal Server Error", "An unexpected error occurred", 500)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
