package com.SeatAllotment.SeatAllotment.exception;

public class SeatNotFoundException extends RuntimeException {
    public SeatNotFoundException(String message) {
        super(message);
    }

    public SeatNotFoundException(Long seatId) {
        super("Seat with ID " + seatId + " not found");
    }
}
