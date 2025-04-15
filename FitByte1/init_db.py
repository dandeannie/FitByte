from flask import Flask
from config import Config
from models import db, User, UserPreferences

def init_db():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize database
    db.init_app(app)
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@fitbyte.com',
                name='Admin User'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            
            # Create default preferences for admin
            admin_prefs = UserPreferences(user=admin)
            db.session.add(admin_prefs)
            
            db.session.commit()
            print("Database initialized with admin user")

if __name__ == '__main__':
    init_db() 