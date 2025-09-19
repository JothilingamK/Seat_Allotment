package com.SeatAllotment.SeatAllotment.service;

import com.SeatAllotment.SeatAllotment.Enum.SeatStatus;
import com.SeatAllotment.SeatAllotment.Model.Employee;
import com.SeatAllotment.SeatAllotment.Model.Seat;
import com.SeatAllotment.SeatAllotment.Repository.EmployeeRepository;
import com.SeatAllotment.SeatAllotment.Repository.SeatRepository;
import com.SeatAllotment.SeatAllotment.exception.EmployeeNotFoundException;
import com.SeatAllotment.SeatAllotment.exception.SeatNotFoundException;
import com.SeatAllotment.SeatAllotment.exception.SeatUnavailableException;
import com.SeatAllotment.SeatAllotment.exception.ValidationException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SeatRepository seatRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        employee.ifPresent(emp -> System.out.println("Employee Data: " + emp));
        return employee;
    }

    public Optional<Employee> getEmployeeBySeat(String seatId) {
        return employeeRepository.findBySeatId(seatId);
    }

    @Transactional
    public void resetSeatByEmployeeId(Long employeeId) {
        Optional<Seat> seat = seatRepository.findByEmployeeId(employeeId);
        if (seat.isPresent()) {
            Seat updatedSeat = seat.get();
            updatedSeat.setEmployeeId(null);
            updatedSeat.setStatus(SeatStatus.VACANT);
            seatRepository.save(updatedSeat);
        }
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> updateEmployee(Long id, Employee updatedEmployee) {
        Map<String, Object> response = new HashMap<>();

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        String newSeatId = updatedEmployee.getSeatId();
        String currentSeatId = existingEmployee.getSeatId();

        if (!newSeatId.equalsIgnoreCase(currentSeatId)) {
            if (newSeatId.equalsIgnoreCase("Work From Home") || newSeatId.equalsIgnoreCase("Unassigned")) {
                resetSeatByEmployeeId(existingEmployee.getEmployeeid());
                existingEmployee.setSeatId(newSeatId);
            } else {
                Seat newSeat = seatRepository.findById(newSeatId)
                        .orElseThrow(() -> new SeatNotFoundException(newSeatId));

                if (newSeat.getStatus() == SeatStatus.OCCUPIED) {
                    response.put("message", "❌ Seat " + newSeatId + " is already occupied!");
                    return ResponseEntity.badRequest().body(response);
                }

                resetSeatByEmployeeId(existingEmployee.getEmployeeid());
                newSeat.setStatus(SeatStatus.OCCUPIED);
                newSeat.setEmployeeId(id);
                seatRepository.save(newSeat);
                existingEmployee.setSeatId(newSeatId);
            }
        }

        existingEmployee.setName(updatedEmployee.getName());
        existingEmployee.setRole(updatedEmployee.getRole());
        existingEmployee.setDepartment(updatedEmployee.getDepartment());

        Employee savedEmployee = employeeRepository.save(existingEmployee);
        response.put("message", "✅ Employee updated successfully");
        response.put("employee", savedEmployee);

        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> deleteEmployeeWithSeatReset(Long id) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Employee> employee = employeeRepository.findById(id);
            if (!employee.isPresent()) {
                response.put("error", "Employee Not Found");
                response.put("message", "Employee with ID " + id + " not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Employee emp = employee.get();
            String employeeName = emp.getName();

            // Reset the seat if assigned (atomic operation)
            resetSeatByEmployeeId(id);

            // Delete the employee (atomic operation)
            employeeRepository.deleteById(id);

            response.put("message", "Employee '" + employeeName + "' (ID: " + id + ") deleted successfully.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Transaction will automatically rollback due to @Transactional
            response.put("error", "Deletion Failed");
            response.put("message", "Failed to delete employee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> addEmployee(Employee employee) {
        Map<String, Object> response = new HashMap<>();

        // Validate Employee ID
        if (employee.getId() == null) {
            throw new ValidationException("Employee ID must be provided");
        }

        System.out.println("🔍 Seat ID Received: " + employee.getSeatId());

        // ✅ Allow "Work From Home" and "Unassigned" without checking the database
        if ("Work From Home".equalsIgnoreCase(employee.getSeatId())
                || "Unassigned".equalsIgnoreCase(employee.getSeatId())) {
            response.put("message", "✅ Employee assigned to " + employee.getSeatId());
            return saveEmployee(employee, response);
        }

        // Validate manual seat assignment (Only check real seats)
        Optional<Seat> seatOpt = seatRepository.findById(employee.getSeatId());

        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();

            if (seat.getStatus() != SeatStatus.VACANT) {
                throw new SeatUnavailableException(
                        "Seat " + seat.getId() + " is already occupied! Please select a different seat.");
            }

            // Assign seat and update status
            seat.setStatus(SeatStatus.OCCUPIED);
            seat.setEmployeeId(employee.getId());
            seatRepository.save(seat); // Update seat table

            employee.setSeatId(String.valueOf(seat.getId())); // Ensure seat ID is stored correctly
            response.put("message", "✅ Employee assigned to seat " + seat.getId());
        } else {
            throw new SeatNotFoundException(employee.getSeatId());
        }

        return saveEmployee(employee, response);
    }

    private ResponseEntity<Map<String, Object>> saveEmployee(Employee employee, Map<String, Object> response) {
        Employee savedEmployee = employeeRepository.save(employee);
        response.put("employee", savedEmployee);
        return ResponseEntity.ok(response);
    }

}
