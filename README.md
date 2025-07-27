# FitByte - Fitness Tracking Application

A comprehensive fitness tracking web application built with Flask, SQLAlchemy, and modern web technologies. Track your workouts, meals, goals, and progress with an intuitive interface.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of fitness statistics and recent activity
- **Workout Tracking**: Log and track different types of workouts
- **Calorie Management**: Track daily calorie intake and macronutrients
- **BMI Calculator**: Calculate and track BMI with category classification
- **Goal Setting**: Set and monitor fitness goals with progress tracking
- **Community**: Join fitness communities and connect with others
- **Diet Planning**: Generate personalized diet plans and recipes
- **Progress Visualization**: Charts and graphs to visualize your fitness journey

## Technology Stack

- **Backend**: Flask (Python web framework)
- **Database**: SQLAlchemy ORM with SQLite
- **Authentication**: Flask-Login
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Styling**: Custom CSS with modern design

## Database Schema

### Core Tables

1. **User**: User profiles and authentication
2. **Workout**: Workout sessions and tracking
3. **Meal**: Food intake and nutrition tracking
4. **Goal**: Fitness goals and progress
5. **BMIRecord**: BMI calculations and history
6. **DietPlan**: Personalized diet plans

## Installation and Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FitBy/FitByte1/FitByte1
```

### Step 2: Create Virtual Environment

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Initialize Database

```bash
python run.py
```

This will:
- Create the SQLite database
- Initialize all tables
- Seed sample data for testing

### Step 5: Run the Application

```bash
python run.py
```

The application will be available at `http://localhost:5000`

## Project Structure

```
FitByte1/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── database.py           # Database utilities
├── run.py               # Application entry point
├── requirements.txt     # Python dependencies
├── static/              # Static files
│   ├── css/
│   │   └── styles.css   # Main stylesheet
│   └── js/
│       └── particles.js # Background animation
├── templates/           # HTML templates
│   ├── base.html        # Base template
│   ├── dashboard.html   # Dashboard page
│   ├── login.html       # Login page
│   └── signup.html      # Registration page
└── instance/            # Database files
    └── fitbyte.db       # SQLite database
```

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /logout` - User logout

### Dashboard
- `GET /dashboard` - Main dashboard with user stats

### Workouts
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Add new workout

### Meals
- `GET /api/meals` - Get user's meals
- `POST /api/meals` - Add new meal

### Goals
- `GET /api/goals` - Get user's goals
- `POST /api/goals` - Add new goal

### BMI
- `POST /api/bmi` - Calculate and save BMI

### Diet Plans
- `POST /api/diet-plan` - Save diet plan

## Database Models

### User Model
```python
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
```

### Workout Model
```python
class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_type = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    calories_burned = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## Configuration

The application uses different configuration classes for different environments:

- **DevelopmentConfig**: For development with debug mode enabled
- **ProductionConfig**: For production deployment
- **TestingConfig**: For running tests

Environment variables can be set to override default settings:

```bash
export FLASK_ENV=development
export SECRET_KEY=your-secret-key
export DATABASE_URL=sqlite:///fitbyte.db
```

## Sample Data

The application comes with sample data for testing:

- Demo user account (username: `demo_user`, password: `password123`)
- Sample workouts, meals, and goals
- BMI records and diet plans

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Mobile app development
- [ ] Social features and challenges
- [ ] Integration with fitness devices
- [ ] Advanced analytics and insights
- [ ] Meal planning and grocery lists
- [ ] Workout video tutorials
- [ ] Progress photos and measurements
- [ ] Export data functionality 
