from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitbyte.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    date_of_birth = db.Column(db.Date)
    height = db.Column(db.Float)  # in cm
    weight = db.Column(db.Float)  # in kg
    gender = db.Column(db.String(10))
    activity_level = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workouts = db.relationship('Workout', backref='user', lazy=True)
    meals = db.relationship('Meal', backref='user', lazy=True)
    goals = db.relationship('Goal', backref='user', lazy=True)
    bmi_records = db.relationship('BMIRecord', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_bmi(self):
        if self.height and self.weight:
            height_m = self.height / 100
            return self.weight / (height_m * height_m)
        return None

    def get_bmi_category(self):
        bmi = self.get_bmi()
        if bmi is None:
            return None
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal weight"
        elif bmi < 30:
            return "Overweight"
        else:
            return "Obese"

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_type = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    calories_burned = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'workout_type': self.workout_type,
            'duration': self.duration,
            'calories_burned': self.calories_burned,
            'notes': self.notes,
            'date': self.date.strftime('%Y-%m-%d'),
            'created_at': self.created_at.isoformat()
        }

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    meal_name = db.Column(db.String(100), nullable=False)
    meal_time = db.Column(db.Time, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    protein = db.Column(db.Float, nullable=False)  # in grams
    carbs = db.Column(db.Float, nullable=False)    # in grams
    fats = db.Column(db.Float, nullable=False)     # in grams
    date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'meal_name': self.meal_name,
            'meal_time': self.meal_time.strftime('%H:%M'),
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'date': self.date.strftime('%Y-%m-%d'),
            'created_at': self.created_at.isoformat()
        }

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    goal_name = db.Column(db.String(100), nullable=False)
    target_value = db.Column(db.Float, nullable=False)
    current_value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    def get_progress_percentage(self):
        if self.target_value == 0:
            return 0
        return min((self.current_value / self.target_value) * 100, 100)

    def to_dict(self):
        return {
            'id': self.id,
            'goal_name': self.goal_name,
            'target_value': self.target_value,
            'current_value': self.current_value,
            'unit': self.unit,
            'is_completed': self.is_completed,
            'progress': self.get_progress_percentage(),
            'created_at': self.created_at.isoformat(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class BMIRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    bmi_value = db.Column(db.Float, nullable=False)
    bmi_category = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'weight': self.weight,
            'height': self.height,
            'bmi_value': self.bmi_value,
            'bmi_category': self.bmi_category,
            'date': self.date.strftime('%Y-%m-%d'),
            'created_at': self.created_at.isoformat()
        }

class DietPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_name = db.Column(db.String(100), nullable=False)
    diet_type = db.Column(db.String(50), nullable=False)
    calorie_goal = db.Column(db.Integer, nullable=False)
    plan_data = db.Column(db.Text)  # JSON string of meal plan
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'plan_name': self.plan_name,
            'diet_type': self.diet_type,
            'calorie_goal': self.calorie_goal,
            'plan_data': self.plan_data,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            login_user(user)
            return jsonify({'success': True, 'redirect': url_for('dashboard')})
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'})
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'message': 'Username already exists'})
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'Email already registered'})
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Account created successfully'})
    
    return render_template('signup.html')

@app.route('/dashboard')
@login_required
def dashboard():
    # Get user stats
    total_workouts = Workout.query.filter_by(user_id=current_user.id).count()
    total_calories_burned = db.session.query(db.func.sum(Workout.calories_burned)).filter_by(user_id=current_user.id).scalar() or 0
    active_goals = Goal.query.filter_by(user_id=current_user.id, is_completed=False).count()
    
    # Calculate progress (example: based on completed goals)
    total_goals = Goal.query.filter_by(user_id=current_user.id).count()
    completed_goals = Goal.query.filter_by(user_id=current_user.id, is_completed=True).count()
    progress = (completed_goals / total_goals * 100) if total_goals > 0 else 0
    
    # Get recent activity
    recent_workouts = Workout.query.filter_by(user_id=current_user.id).order_by(Workout.date.desc()).limit(5).all()
    recent_meals = Meal.query.filter_by(user_id=current_user.id).order_by(Meal.date.desc()).limit(5).all()
    
    stats = {
        'total_workouts': total_workouts,
        'calories_burned': total_calories_burned,
        'active_goals': active_goals,
        'progress': round(progress, 1)
    }
    
    recent_activity = {
        'workouts': [w.to_dict() for w in recent_workouts],
        'meals': [m.to_dict() for m in recent_meals]
    }
    
    return render_template('dashboard.html', stats=stats, recent_activity=recent_activity)

@app.route('/bmi-calculator')
def bmi_calculator():
    return render_template('bmi.html')

@app.route('/workouts')
@login_required
def workouts():
    return render_template('workouts.html')

@app.route('/calories')
@login_required
def calories():
    return render_template('calories.html')

@app.route('/goals')
@login_required
def goals():
    return render_template('goals.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/diet-plan')
@login_required
def diet_plan():
    return render_template('diet-plan.html')

# API Routes for AJAX calls
@app.route('/api/workouts', methods=['GET', 'POST'])
@login_required
def workouts_api():
    if request.method == 'POST':
        data = request.get_json()
        new_workout = Workout(
            user_id=current_user.id,
            workout_type=data['workout_type'],
            duration=data['duration'],
            calories_burned=data['calories_burned'],
            notes=data.get('notes', '')
        )
        db.session.add(new_workout)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Workout added successfully'})
    
    # GET request - return user's workouts
    workouts = Workout.query.filter_by(user_id=current_user.id).order_by(Workout.date.desc()).all()
    return jsonify([w.to_dict() for w in workouts])

@app.route('/api/meals', methods=['GET', 'POST'])
@login_required
def meals_api():
    if request.method == 'POST':
        data = request.get_json()
        new_meal = Meal(
            user_id=current_user.id,
            meal_name=data['meal_name'],
            meal_time=datetime.strptime(data['meal_time'], '%H:%M').time(),
            calories=data['calories'],
            protein=data['protein'],
            carbs=data['carbs'],
            fats=data['fats']
        )
        db.session.add(new_meal)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Meal added successfully'})
    
    # GET request - return today's meals
    today = date.today()
    meals = Meal.query.filter_by(user_id=current_user.id, date=today).order_by(Meal.meal_time).all()
    return jsonify([m.to_dict() for m in meals])

@app.route('/api/goals', methods=['GET', 'POST'])
@login_required
def goals_api():
    if request.method == 'POST':
        data = request.get_json()
        new_goal = Goal(
            user_id=current_user.id,
            goal_name=data['goal_name'],
            target_value=data['target_value'],
            current_value=data['current_value'],
            unit=data['unit']
        )
        db.session.add(new_goal)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Goal added successfully'})
    
    # GET request - return user's goals
    goals = Goal.query.filter_by(user_id=current_user.id).order_by(Goal.created_at.desc()).all()
    return jsonify([g.to_dict() for g in goals])

@app.route('/api/bmi', methods=['POST'])
@login_required
def bmi_api():
    data = request.get_json()
    weight = float(data['weight'])
    height = float(data['height']) / 100  # Convert cm to meters
    bmi_value = weight / (height * height)
    
    # Determine BMI category
    if bmi_value < 18.5:
        category = "Underweight"
    elif bmi_value < 25:
        category = "Normal weight"
    elif bmi_value < 30:
        category = "Overweight"
    else:
        category = "Obese"
    
    # Save BMI record
    bmi_record = BMIRecord(
        user_id=current_user.id,
        weight=weight,
        height=height * 100,  # Store in cm
        bmi_value=bmi_value,
        bmi_category=category
    )
    db.session.add(bmi_record)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'bmi': round(bmi_value, 1),
        'category': category
    })

@app.route('/api/diet-plan', methods=['POST'])
@login_required
def diet_plan_api():
    data = request.get_json()
    
    # Create new diet plan
    new_plan = DietPlan(
        user_id=current_user.id,
        plan_name=data['plan_name'],
        diet_type=data['diet_type'],
        calorie_goal=data['calorie_goal'],
        plan_data=data['plan_data']
    )
    
    # Deactivate other plans
    DietPlan.query.filter_by(user_id=current_user.id).update({'is_active': False})
    
    db.session.add(new_plan)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Diet plan saved successfully'})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 