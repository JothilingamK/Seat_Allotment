package com.SeatAllotment.SeatAllotment.Controller;

import com.SeatAllotment.SeatAllotment.Enum.SeatStatus;
import com.SeatAllotment.SeatAllotment.Model.Seat;
import com.SeatAllotment.SeatAllotment.Model.Employee;
import com.SeatAllotment.SeatAllotment.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/{seatId}/employee-details")
    public ResponseEntity<?> getEmployeeBySeat(@PathVariable String seatId) {
        Optional<Seat> seatOptional = seatService.getSeatById(seatId);

        if (seatOptional.isPresent()) {
            Seat seat = seatOptional.get();
            Optional<Employee> employeeOptional = seatService.getEmployeeBySeat(seatId);

            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();

                // Seat is OCCUPIED — return employee details
                return ResponseEntity.ok().body(new Object() {
                    public final String seatId = seat.getId();
                    public final String status = seat.getStatus().toString();
                    public final String employeeName = employee.getName();
                    public final String role = employee.getRole();
                    public final String department = employee.getDepartment();
                });
            }

            // Seat is not OCCUPIED — return actual status and message
            return ResponseEntity.ok().body(new Object() {
                public final String seatId = seat.getId();
                public final String status = seat.getStatus().toString(); // Use real status
                public final String message = seat.getStatus() == SeatStatus.RESERVED
                        ? "Seat is reserved"
                        : "Seat is vacant";
            });
        }

        // Seat not found
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/vacant")
    public ResponseEntity<List<Seat>> getVacantSeats() {
        List<Seat> vacantSeats = seatService.getVacantSeats();
        return ResponseEntity.ok(vacantSeats);
    }
}