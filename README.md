# 🏢 Seat Allotment System

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://github.com/JothilingamK/Seat_Allotment)
[![Angular](https://img.shields.io/badge/Angular-19-red.svg)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A comprehensive **production-ready** seat allocation management system built with modern technologies. This system allows organizations to efficiently manage employee seat assignments, track seat availability, and generate detailed reports.

## 🌟 Features

### 🎯 Core Functionality
- **Employee Management** - Complete CRUD operations for employee data
- **Seat Allocation** - Interactive visual floor plan with real-time seat status
- **Bulk Operations** - Excel file upload with validation and error reporting
- **Search & Filter** - Advanced search capabilities with pagination
- **Reports** - Generate PDF and Excel reports for seat allocation

### 🎨 User Experience
- **Modern UI** - Responsive design with Bootstrap 5 and custom styling
- **Interactive Floor Plan** - Visual seat map with click-to-view details
- **Real-time Updates** - Live seat status updates and availability tracking
- **Toast Notifications** - User-friendly feedback system
- **Mobile Responsive** - Optimized for all device sizes

### 🛡️ Security & Performance
- **Input Validation** - Comprehensive data validation and sanitization
- **CORS Configuration** - Secure cross-origin resource sharing
- **Database Optimization** - Indexed queries and connection pooling
- **Error Handling** - Graceful error handling with user feedback
- **Health Monitoring** - Built-in health check endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Angular 19    │◄──►│   Spring Boot   │◄──►│   MySQL 8.0     │
│   Bootstrap 5   │    │   Java 21       │    │   Hibernate     │
│   TypeScript    │    │   REST API      │    │   JPA           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- Java 21+ (for development)
- MySQL 8.0+ (for development)

### 🐳 Docker Deployment (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/JothilingamK/Seat_Allotment.git
cd Seat_Allotment
```

2. **Deploy with Docker Compose**
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

3. **Access the application**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306

### 🛠️ Manual Development Setup

#### Backend Setup
```bash
cd SeatAllotment-Backend-master
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd SeatAllotment-main
npm install
npm start
```

## 📁 Project Structure

```
Seat_Allotment/
├── 📁 SeatAllotment-Backend-master/     # Spring Boot Backend
│   ├── 📁 src/main/java/               # Java source code
│   ├── 📁 src/main/resources/          # Configuration files
│   ├── 📄 Dockerfile                   # Backend container config
│   └── 📄 pom.xml                      # Maven dependencies
├── 📁 SeatAllotment-main/              # Angular Frontend
│   ├── 📁 src/app/                     # Angular application
│   ├── 📁 src/assets/                  # Static assets
│   ├── 📄 Dockerfile                   # Frontend container config
│   ├── 📄 nginx.conf                   # Web server config
│   └── 📄 package.json                 # Node dependencies
├── 📄 docker-compose.yml               # Container orchestration
├── 📄 init.sql                         # Database initialization
├── 📄 README-PRODUCTION.md             # Production deployment guide
└── 📄 PRODUCTION-CHECKLIST.md          # Deployment checklist
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
DB_PASSWORD=your_secure_password
DB_USERNAME=root
PORT=8080
```

### Database Configuration
The system uses MySQL with the following default settings:
- **Host**: localhost:3306
- **Database**: seat_allotment
- **Username**: root
- **Password**: root (change in production)

## 📊 API Endpoints

### Employee Management
- `GET /employees` - Get all employees
- `POST /employees` - Create new employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

### Seat Management
- `GET /seats` - Get all seats
- `GET /seats/{id}` - Get seat details
- `GET /seats/vacant` - Get vacant seats

## 🎨 UI Components

### Employee Dashboard
- **Statistics Cards** - Total employees, allocated seats, vacant seats, WFH count
- **Search & Filter** - Advanced search with real-time filtering
- **Data Table** - Paginated table with sorting and actions
- **Bulk Upload** - Excel file upload with drag-and-drop

### Seat Management
- **Interactive Floor Plan** - Visual seat map with status indicators
- **Seat Details Modal** - Employee information and seat status
- **Real-time Updates** - Live seat availability tracking

## 🛡️ Security Features

- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Secure cross-origin requests
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization and output encoding
- **Security Headers** - Comprehensive security headers

## 📈 Performance Optimizations

### Frontend
- **Angular Production Build** - Optimized bundle size
- **Lazy Loading** - Code splitting for better performance
- **Asset Caching** - Long-term caching for static resources
- **Gzip Compression** - Compressed asset delivery

### Backend
- **Connection Pooling** - HikariCP for database connections
- **Query Optimization** - Indexed database queries
- **Caching** - Application-level caching
- **Health Monitoring** - Performance tracking endpoints

## 🚀 Production Deployment

### Docker Deployment
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

### Manual Deployment
See [README-PRODUCTION.md](README-PRODUCTION.md) for detailed production deployment instructions.

## 📚 Documentation

- **[Production Deployment Guide](README-PRODUCTION.md)** - Complete production setup
- **[Production Checklist](PRODUCTION-CHECKLIST.md)** - Deployment checklist
- **[API Documentation](docs/api.md)** - API endpoint documentation
- **[Database Schema](docs/database.md)** - Database structure and relationships

## 🧪 Testing

### Backend Tests
```bash
cd SeatAllotment-Backend-master
mvn test
```

### Frontend Tests
```bash
cd SeatAllotment-main
npm test
```

### Integration Tests
```bash
# Run with Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🔍 Monitoring & Health Checks

### Health Endpoints
- **Backend Health**: `GET /actuator/health`
- **Frontend Health**: `GET /health`
- **Database Health**: MySQL connection monitoring

### Logging
- **Application Logs**: Structured logging with different levels
- **Access Logs**: HTTP request/response logging
- **Error Logs**: Comprehensive error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/JothilingamK/Seat_Allotment/issues)
- **Documentation**: Check the documentation files
- **Email**: Contact the development team

## 🎉 Acknowledgments

- **Angular Team** - For the amazing frontend framework
- **Spring Team** - For the robust backend framework
- **Bootstrap Team** - For the responsive UI components
- **MySQL Team** - For the reliable database system

---

**⭐ Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/JothilingamK/Seat_Allotment.svg?style=social&label=Star)](https://github.com/JothilingamK/Seat_Allotment)
[![GitHub forks](https://img.shields.io/github/forks/JothilingamK/Seat_Allotment.svg?style=social&label=Fork)](https://github.com/JothilingamK/Seat_Allotment/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/JothilingamK/Seat_Allotment.svg?style=social&label=Watch)](https://github.com/JothilingamK/Seat_Allotment)
