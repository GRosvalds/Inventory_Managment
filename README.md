# Inventory Management System

A comprehensive inventory management solution built with Laravel and modern web technologies. Streamline your inventory operations with real-time tracking, automated alerts, and powerful analytics.

## Live Demo

**Production Environment**: [imanagement.up.railway.app](https://imanagement.up.railway.app)

## Documentation

📄 **Exam Documentation**: [Download Rosvalds_Eksamena_Dokumentācija.docx && Rosvalds_Eksamena_Dokumentācija.pdf](https://failiem.lv/u/6gkh46cr63)

---

## Features

- **Real-time Inventory Tracking** - Monitor stock levels instantly
- **Advanced Reporting** - Generate comprehensive inventory reports
- **User Role Management** - Control access with different permission levels

---

## Tech Stack

- **Backend**: Laravel 11.x (PHP 8.4)
- **Frontend**: Blade Templates + React.js
- **Database**: MySQL 8.0
- **Containerization**: Docker & Laravel Sail
- **Package Manager**: Composer & NPM

---

## Quick Start Guide

### Prerequisites

- Docker Desktop installed and running
- Git installed on your system

### Installation Steps

#### Clone the Repository
```bash
git clone https://github.com/GRosvalds/Inventory_Managment.git
```

#### Navigate to Project Directory
```bash
cd inventory-managment
```

#### Install PHP Dependencies
```bash
docker run --rm \
 -u "$(id -u):$(id -g)" \
 -v "$(pwd):/var/www/html" \
 -w /var/www/html \
 laravelsail/php84-composer:latest \
 composer install --ignore-platform-reqs
```

#### Environment Configuration
```bash
# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Paste these into .env
```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=lvt.4pt@gmail.com
MAIL_PASSWORD=npdwkuswhumpooct
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="lvt.4pt@gmail.com"
MAIL_FROM_NAME="Invenotory_Managment"
```

#### Configure Docker Environment
```bash
# Install Laravel Sail
php artisan sail:install

# Start Docker containers
./vendor/bin/sail up -d
```

> **Troubleshooting Port Conflicts:**
> ```bash
> # Check for port conflicts
> docker ps -a | grep :80
> 
> # Remove conflicting containers
> docker rm -f <container_id>
> ```

#### Install Frontend Dependencies
```bash
./vendor/bin/sail npm install
```

#### Database Setup
```bash
# Run migrations and seed data
./vendor/bin/sail artisan migrate:fresh --seed
```
*Note: The seeder will prompt you to specify the number of sample records to create for different entity types.*

#### Build Frontend Assets
```bash
# For development
./vendor/bin/sail npm run dev

# For production
./vendor/bin/sail npm run build
```

---

## Application Access

| Service | URL | Description |
|---------|-----|-------------|
| **Web Application** | [http://localhost](http://localhost) | Main inventory management interface |
| **Database Admin** | [http://localhost:3306](http://localhost:3306) | Database instance |

### Database Credentials
- **Username**: `sail`
- **Password**: `password`
---

## Default Login Credentials

Get started immediately with these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | gabriels.rosvalds@gmail.com | password |
| **Moderator** | gabriels.rosvalds.devs@gamil.com | password |
| **User/Employee** | rosvalds4321@gmail.com | password |

---

## Available Commands

### Development Commands
```bash
# Start the application
./vendor/bin/sail up -d

# Stop the application
./vendor/bin/sail down

# View logs
./vendor/bin/sail logs

```

### Database Commands
```bash
# Fresh migration with seeding
./vendor/bin/sail artisan migrate:fresh --seed

# Create new migration
./vendor/bin/sail artisan make:migration create_table_name

# Run specific seeder
./vendor/bin/sail artisan db:seed --class=UserSeeder
```

---

## Project Structure

```
inventory-management/
├── app/                    # Application logic
│   ├── Http/Controllers/   # Request handlers
│   ├── Models/            # Eloquent models
│   └── Services/          # Business logic
├── database/
│   ├── migrations/        # Database schema
│   └── seeders/          # Sample data
├── resources/
│   ├── views/            # Blade templates
│   ├── js/               # JavaScript assets
├── routes/               # Application routes
└── docker-compose.yml    # Docker configuration
```

## Support

For support and questions:
-  Email: gabriels.rosvalds@gmail.com
---

<div align="center">
  <p>Made for efficient inventory management</p>
</div>
