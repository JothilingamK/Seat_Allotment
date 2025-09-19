package com.SeatAllotment.SeatAllotment.Controller;

import com.SeatAllotment.SeatAllotment.Model.Employee;
import com.SeatAllotment.SeatAllotment.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/employees")
public class EmployeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/list")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);

        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-seat/{seatId}")
    public ResponseEntity<Employee> getEmployeeBySeat(@PathVariable String seatId) {
        Optional<Employee> employee = employeeService.getEmployeeBySeat(seatId);
        return employee.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> addEmployee(@RequestBody Map<String, Object> requestBody) {
        System.out.println("🔍 Raw Request Data: " + requestBody);

        Employee employee = new Employee();

        // Convert employeeid to Long (Fix Type Issue)
        try {
            if (requestBody.get("employeeid") == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Validation Failed", "message", "Employee ID is required"));
            }
            employee.setId(Long.parseLong(requestBody.get("employeeid").toString()));
        } catch (NumberFormatException | NullPointerException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Validation Failed", "message",
                    "Invalid Employee ID format. It must be a number."));
        }

        // Set other fields with validation
        if (requestBody.get("name") == null || requestBody.get("name").toString().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Validation Failed", "message", "Employee name is required"));
        }
        employee.setName(requestBody.get("name").toString().trim());

        if (requestBody.get("department") == null || requestBody.get("department").toString().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Validation Failed", "message", "Employee department is required"));
        }
        employee.setDepartment(requestBody.get("department").toString().trim());

        if (requestBody.get("role") == null || requestBody.get("role").toString().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Validation Failed", "message", "Employee role is required"));
        }
        employee.setRole(requestBody.get("role").toString().trim());

        // Fix Seat ID Issue
        String seatId = requestBody.get("seat_id") != null ? requestBody.get("seat_id").toString() : "Unassigned";
        employee.setSeatId(seatId);

        System.out.println("🔍 Processed Employee Object: " + employee.toString());

        return employeeService.addEmployee(employee);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateEmployee(
            @PathVariable Long id, @RequestBody Employee updatedEmployee) {
        return employeeService.updateEmployee(id, updatedEmployee);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            return employeeService.deleteEmployeeWithSeatReset(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Deletion Failed", "message", "Failed to delete employee: " + e.getMessage()));
        }
    }

}