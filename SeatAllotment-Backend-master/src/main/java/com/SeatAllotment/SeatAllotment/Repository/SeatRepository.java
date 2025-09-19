package com.SeatAllotment.SeatAllotment.Repository;

import com.SeatAllotment.SeatAllotment.Enum.SeatStatus;
import com.SeatAllotment.SeatAllotment.Model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, String> {
    @NonNull
    Optional<Seat> findById(@NonNull String id);

    List<Seat> findByStatus(SeatStatus status);

    Optional<Seat> findByEmployeeId(Long employeeId);
}