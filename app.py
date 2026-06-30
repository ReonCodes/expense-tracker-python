from flask import Flask, render_template, request, jsonify
from models import db, Expense

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    category = request.args.get('category')
    if category and category != 'All':
        expenses = Expense.query.filter_by(category=category).all()
    else:
        expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses])


@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = Expense(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        date=data['date']
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201


@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


if __name__ == '__main__':
    app.run(debug=True)
