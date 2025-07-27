from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

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
    workouts = db.relationship('Workout', backref='user', lazy=True, cascade='all, delete-orphan')
    meals = db.relationship('Meal', backref='user', lazy=True, cascade='all, delete-orphan')
    goals = db.relationship('Goal', backref='user', lazy=True, cascade='all, delete-orphan')
    bmi_records = db.relationship('BMIRecord', backref='user', lazy=True, cascade='all, delete-orphan')
    diet_plans = db.relationship('DietPlan', backref='user', lazy=True, cascade='all, delete-orphan')

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

    def get_daily_calorie_goal(self):
        """Calculate daily calorie goal based on BMR and activity level"""
        if not all([self.weight, self.height, self.date_of_birth, self.gender]):
            return 2000  # Default value
        
        # Calculate age
        today = date.today()
        age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        
        # Calculate BMR using Mifflin-St Jeor Equation
        if self.gender.lower() == 'male':
            bmr = 10 * self.weight + 6.25 * self.height - 5 * age + 5
        else:
            bmr = 10 * self.weight + 6.25 * self.height - 5 * age - 161
        
        # Apply activity multiplier
        activity_multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
        }
        
        multiplier = activity_multipliers.get(self.activity_level, 1.2)
        return int(bmr * multiplier)

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