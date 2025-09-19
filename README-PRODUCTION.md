# Seat Allotment System - Production Deployment Guide

## 🚀 Overview

This is a comprehensive seat allocation management system built with Angular frontend and Spring Boot backend. The system allows organizations to manage employee seat assignments, track seat availability, and generate reports.

## 🏗️ Architecture

- **Frontend**: Angular 19 with Bootstrap 5
- **Backend**: Spring Boot 3.4.3 with Java 21
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for production)

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 21+ (for local development)
- MySQL 8.0+ (for local development)

## 🚀 Quick Start (Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd SeatAllotment
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DB_PASSWORD=your_secure_password
DB_USERNAME=root
PORT=8080
```

### 3. Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306

## 🛠️ Manual Deployment

### Backend Deployment

1. **Build the Backend**
```bash
cd SeatAllotment-Backend-master
mvn clean package -DskipTests
```

2. **Run with Production Profile**
```bash
java -jar target/SeatAllotment-*.jar --spring.profiles.active=prod
```

### Frontend Deployment

1. **Install Dependencies**
```bash
cd SeatAllotment-main
npm ci --only=production
```

2. **Build for Production**
```bash
npm run build -- --configuration=production
```

3. **Serve with Nginx**
```bash
# Copy built files to nginx directory
cp -r dist/seat-allotment-system/* /usr/share/nginx/html/

# Start nginx
nginx -g "daemon off;"
```

## 🔧 Configuration

### Database Configuration

The system supports MySQL with the following default configuration:

```properties
# Production Database Settings
spring.datasource.url=jdbc:mysql://localhost:3306/seat_allotment?useSSL=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PASSWORD` | Database password | `root` |
| `DB_USERNAME` | Database username | `root` |
| `DB_URL` | Database connection URL | Auto-generated |
| `PORT` | Backend server port | `8080` |

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Backend Health**: `GET /actuator/health`
- **Frontend Health**: `GET /health`

### Logging
- **Backend Logs**: Available in container logs
- **Frontend Logs**: Nginx access/error logs
- **Database Logs**: MySQL container logs

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Change default database passwords
- [ ] Use HTTPS in production
- [ ] Configure proper CORS settings
- [ ] Enable database SSL connections
- [ ] Set up proper firewall rules
- [ ] Regular security updates
- [ ] Backup strategy implementation

### Security Headers
The application includes security headers:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📈 Performance Optimization

### Frontend Optimizations
- Gzip compression enabled
- Static asset caching (1 year)
- Angular production build optimizations
- Lazy loading implemented

### Backend Optimizations
- Connection pooling configured
- JPA query optimization
- Proper indexing on database tables
- Health check endpoints

## 🗄️ Database Management

### Backup
```bash
# Create database backup
docker exec seat-allotment-db mysqldump -u root -p seat_allotment > backup.sql

# Restore from backup
docker exec -i seat-allotment-db mysql -u root -p seat_allotment < backup.sql
```

### Migration
The application uses JPA with `ddl-auto=validate` in production, ensuring schema consistency.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check database credentials
   - Verify network connectivity
   - Check database service status

2. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify Angular CLI version

3. **Docker Issues**
   - Check Docker daemon status
   - Verify port availability
   - Check container logs

### Log Locations
- **Backend**: `docker-compose logs backend`
- **Frontend**: `docker-compose logs frontend`
- **Database**: `docker-compose logs mysql`

## 📝 API Documentation

### Main Endpoints
- `GET /seats` - Get all seats
- `GET /seats/{id}` - Get seat details
- `GET /employees` - Get all employees
- `POST /employees` - Create employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

## 🔄 Updates & Maintenance

### Updating the Application
1. Pull latest changes
2. Rebuild Docker images
3. Restart services with `docker-compose up -d --build`

### Monitoring
- Use `docker-compose ps` to check service status
- Monitor logs with `docker-compose logs -f`
- Check health endpoints regularly

## 📞 Support

For issues and support:
1. Check the troubleshooting section
2. Review application logs
3. Verify configuration settings
4. Check system requirements

## 📄 License

This project is licensed under the MIT License.

---

**Production Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database properly initialized
- [ ] Security settings applied
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Performance optimizations enabled
- [ ] Health checks working
- [ ] SSL/TLS configured (if applicable)
