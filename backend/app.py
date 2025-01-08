from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from flask_socketio import SocketIO, emit
import os
import requests
import socket
from zeroconf import ServiceInfo, Zeroconf
import subprocess
import psutil
import logging
from werkzeug.security import generate_password_hash,check_password_hash
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})#running comm with backend and frontend
#*/ all ip address



def get_wifi_details():
    interfaces = psutil.net_if_addrs()
    for interface_name, addresses in interfaces.items():
        for addr in addresses:
            if addr.family == socket.AF_INET:  # IPv4 only
                # print(f"Interface: {interface_name}, IP Address: {addr.address}")
                if interface_name == "Wi-Fi 2":
                    return addr.address
                


# Register mDNS service
def register_mdns_service(local_ip):#esp

    hostname = "flask-server"  # Set a consistent hostname
    local_ip = local_ip
    service_info = ServiceInfo(
        "_http._tcp.local.",
        "FlaskServer._http._tcp.local.",
        addresses=[socket.inet_aton(local_ip)],
        port=5000,
        properties={},
        server=f"{hostname}.local."
    )
    zeroconf = Zeroconf()
    zeroconf.register_service(service_info)
    print(f"mDNS service registered: {local_ip}:5000 as {hostname}.local")

# Database Configuration using mysql-connector-python
#database connection
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

admin_db = {'admin': 'testpass'}

# Define database models


class LabBoy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    number = db.Column(db.String(20))
    age = db.Column(db.Integer)
    password= db.Column(db.String(255), nullable=False)

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(100), nullable=False)
    block = db.Column(db.String(50))
    worker_head_name = db.Column(db.String(100))

class AssignedJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lab_boy_id = db.Column(db.Integer, db.ForeignKey('lab_boy.id'))
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'))
    washroom_id = db.Column(db.Integer, db.ForeignKey('washroom.id'))
    status = db.Column(db.Enum('pending', 'in_progress', 'completed'), default='pending')

class Washroom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    washroom_name=db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer)
    floor_number = db.Column(db.Integer)
    usage_count = db.Column(db.Integer, default=0)
#data from frontend through login api    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')#values are saved
    password = data.get('password')
    role = data.get('role')

    if not name or not password or not role:
        return jsonify({'message': 'All fields are required'}), 400

    if role == 'admin':
        if admin_db.get(name) == password:
            return jsonify({'success': True, 'role': 'admin', 'message': 'successful admin login'}), 200
        else:
            return jsonify({'message': 'Invalid admin credentials'}), 401

    elif role == 'labboy':
        labboy = LabBoy.query.filter_by(name=name).first()
        if labboy and labboy.password == password:
            return jsonify({
                'success': True, 
                'role': 'labboy', 
                'message': 'successful lab boy login', 
                'labboy_id':labboy.id}), 200
            
        else:
            return jsonify({'message': 'Invalid lab boy credentials'}), 401

    else:
        return jsonify({'message': f'Role "{role}" is not recognized'}), 400


@app.route('/api/update_usage_count', methods=['POST'])
def update_usage_count():
    data = request.json  # Parse JSON data from request
    print(data)
    washroom_id = data.get("washroom_id")
    count = data.get("count")

    # Update usage count in database
    washroom = db.session.get(Washroom, washroom_id)
    if washroom:
        washroom.usage_count = count
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Usage count updated'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Washroom not found'}), 404
        

# API endpoints
@app.route('/addlabboy', methods=['POST'])
def add_lab_boy():
    data = request.json
    new_lab_boy = LabBoy(
    name=data['name'],
    number=data['number'],
    age=data['age'],
    password=data['password']
)
    try:
        db.session.add(new_lab_boy)
        db.session.commit()#close
        return jsonify({'status': 'Lab boy added successfully'})
    except Exception as e:
        db.session.rollback()#returns
        return jsonify({'status': 'Error adding lab boy', 'error': str(e)}), 400

@app.route('/adddepartment', methods=['POST'])
def add_department():
    data = request.json
    new_department = Department(department_name=data['department_name'], block=data['block'], worker_head_name=data['worker_head_name'])
    
    try:
        db.session.add(new_department)
        db.session.commit()
        return jsonify({'status': 'Department added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'Error adding department', 'error': str(e)}), 400

@app.route('/addwashroom', methods=['POST'])
def add_washroom():
    data = request.json

    # Extract data from request
    name = data.get('name')
    department_id = data.get('departmentId')
    floor_number = data.get('floor')

    # Validate input data
    if not name or not department_id or not floor_number:
        return jsonify({'message': 'All fields are required'}), 400

    # Create new Washroom instance
    new_washroom = Washroom(department_id=department_id, washroom_name=name, floor_number=floor_number)

    try:
        db.session.add(new_washroom)
        db.session.commit()
        return jsonify({'message': 'Washroom added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding washroom', 'error': str(e)}), 500

@app.route('/api/labboys', methods=['GET'])#send to the frontend
def get_lab_boys():
    lab_boys = LabBoy.query.all()
    
    lab_boys_list = [{'id': lab_boy.id, 'name': lab_boy.name, 'age': lab_boy.age, 'number':lab_boy.number} for lab_boy in lab_boys]
    
    return jsonify(lab_boys_list)

@app.route('/api/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    
    departments_list = [{'id': department.id, 'department_name': department.department_name, 'block':department.block, 'worker_head_name': department.worker_head_name} for department in departments]
    
    return jsonify(departments_list)

@app.route('/api/washrooms', methods=['GET'])
def get_washrooms():
    try:
        # Query all washrooms and join with departments to get department names
        washrooms = db.session.query(
            Washroom.id,
            Washroom.washroom_name,
            Washroom.floor_number,
            Washroom.usage_count,
            Department.department_name
        ).join(Department, Washroom.department_id == Department.id).all()

        # Prepare the response data
        washrooms_list = [
            {
                'id': washroom.id,
                'washroom_name': washroom.washroom_name,
                'department_name': washroom.department_name,
                'floor_number': washroom.floor_number,
                'usage_count': washroom.usage_count
            }
            for washroom in washrooms
        ]

        return jsonify(washrooms_list)
    except Exception as e:
        return jsonify({'status': 'Error fetching washrooms', 'error': str(e)}), 500

@app.route('/assignjob', methods=['POST'])
def assign_job():
    data = request.json
    
    new_job = AssignedJob(lab_boy_id=data['labBoyId'], department_id=data['departmentId'], washroom_id=data['washroomId'])
    
    try:
        db.session.add(new_job)
        db.session.commit()
        return jsonify({'status': 'Job assigned successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'Error assigning job', 'error': str(e)}), 400

@app.route('/api/assigned_jobs', methods=['GET'])
def get_assigned_jobs():
    try:
        # Retrieve labboyId from query parameters
        labboy_id = request.args.get('labboyId')

        # Filter jobs based on labboyId if provided
        if labboy_id:
            jobs = AssignedJob.query.filter_by(status='pending', lab_boy_id=labboy_id).all()
        else:
            jobs = AssignedJob.query.filter_by(status='pending').all()

        # Prepare job list with additional details
        job_list = [
            {
                'id': job.id,
                'department': db.session.get(Department, job.department_id).department_name if job.department_id else None,
                'lab_boy': db.session.get(LabBoy, job.lab_boy_id).name if job.lab_boy_id else None,
                'washroom': db.session.get(Washroom, job.washroom_id).washroom_name if job.washroom_id else None,
                'status': job.status
            }
            for job in jobs
        ]

        return jsonify(job_list), 200

    except Exception as e:
        return jsonify({'status': 'Error fetching assigned jobs', 'error': str(e)}), 500
 
    
@app.route('/api/start_job', methods=['POST'])
def start_job():
    try:
        data = request.json

        # Validate input data
        job_id = data.get('jobId')
        washroom_name = data.get('washroom_name')
        if not job_id or not washroom_name:
            return jsonify({'status': 'Invalid input data'}), 400

        # Query Washroom model
        washroom = Washroom.query.filter_by(washroom_name=washroom_name).first()
        if not washroom:
            return jsonify({'status': 'Washroom not found'}), 404

        # Retrieve job from database
        job = db.session.get(AssignedJob, job_id)
        if not job:
            return jsonify({'status': 'Job not found'}), 404

        # Update job status
        job.status = 'in_progress'
        db.session.commit()

        # Send lock command to ESP32
        try:
            print(washroom.id)
            response = requests.post(
                f"http://{os.getenv('ESP_IP')}/lock",
                json={"washroomId": washroom.id},  # Use 'json' to send JSON payload
                headers={"Content-Type": "application/json"},
                timeout=5
            )

            app.logger.info(f"ESP32 Response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                return jsonify({'status': 'Job started and door locked'})
            else:
                return jsonify({'status': 'Job started but failed to lock door'}), response.status_code

        except Exception as e:
            app.logger.error(f"Error communicating with ESP32: {str(e)}")
            return jsonify({'status': 'Error', 'message': str(e)}), 500

    except Exception as e:
        app.logger.error(f"Unexpected Server Error: {str(e)}")
        return jsonify({'status': 'Internal Server Error', 'message': str(e)}), 500
@app.route('/api/finish_job', methods=['POST'])
def finish_job():
    try:
        data = request.json

        # Validate input data
        job_id = data.get('jobId')
        washroom_name = data.get('washroom_name')
        if not job_id or not washroom_name:
            return jsonify({'status': 'Invalid input data'}), 400

        # Query Washroom model
        washroom = Washroom.query.filter_by(washroom_name=washroom_name).first()
        if not washroom:
            return jsonify({'status': 'Washroom not found'}), 404

        # Retrieve job from database
        job = db.session.get(AssignedJob, job_id)
        if not job:
            return jsonify({'status': 'Job not found'}), 404
    
        job.status = 'completed'
        db.session.commit()
        
        # Send unlock command to ESP32 with washroom ID
        response = requests.post(
                f"http://{os.getenv('ESP_IP')}/unlock",
                json={"washroomId": washroom.id},  # Use 'json' to send JSON payload
                headers={"Content-Type": "application/json"},
                timeout=5
            )
        if response.status_code == 200:
                return jsonify({'status': 'Job finished and door unlocked'})
                


        else:
                return jsonify({'status': 'Job finished but failed to unlock door'}), 500
    except Exception as e:
        return jsonify({'status': 'Job finished but failed to communicate with ESP32', 'error': str(e)}), 500
    
    

# Run the Flask app with WebSocket support
if __name__ == '__main__':
    get_wifi_details()
    local_ip = get_wifi_details()#stores here 
    print(f"Starting server on {local_ip}:5000")
    register_mdns_service(local_ip)#esp module
    socketio.run(app, debug=True, host=local_ip, port=5000)  # Use socketio.run instead of app.run for WebSocket support