package com.SeatAllotment.SeatAllotment.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(String message) {
        super(message);
    }

    public EmployeeNotFoundException(Long employeeId) {
        super("Employee with ID " + employeeId + " not found");
    }
}
