package com.SeatAllotment.SeatAllotment.Controller;

import com.SeatAllotment.SeatAllotment.Enum.SeatStatus;
import com.SeatAllotment.SeatAllotment.Model.Seat;
import com.SeatAllotment.SeatAllotment.Model.Employee;
import com.SeatAllotment.SeatAllotment.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
                Map<String, Object> response = new HashMap<>();
                response.put("seatId", seat.getId());
                response.put("status", seat.getStatus().toString());
                response.put("employeeName", employee.getName());
                response.put("role", employee.getRole());
                response.put("department", employee.getDepartment());
                return ResponseEntity.ok().body(response);
            }

            // Seat is not OCCUPIED — return actual status and message
            Map<String, Object> response = new HashMap<>();
            response.put("seatId", seat.getId());
            response.put("status", seat.getStatus().toString());
            response.put("message", seat.getStatus() == SeatStatus.RESERVED
                    ? "Seat is reserved"
                    : "Seat is vacant");
            return ResponseEntity.ok().body(response);
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