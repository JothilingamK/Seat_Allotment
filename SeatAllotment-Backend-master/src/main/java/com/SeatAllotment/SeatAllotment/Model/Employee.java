package com.SeatAllotment.SeatAllotment.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "employees", uniqueConstraints = @UniqueConstraint(columnNames = "employeeid"))
public class Employee {

    @Id
    @Column(name = "employeeid", nullable = false, unique = true)
    private Long employeeid;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(name = "seat_id", length = 20)
    private String seatId;

    public Employee() {
    }

    public Employee(String name, String role, String department, String seatId) {
        this.name = name;
        this.role = role;
        this.department = department;
        this.seatId = seatId;
    }

    public Long getEmployeeid() {
        return employeeid;
    }

    public void setEmployeeid(Long employeeid) {
        this.employeeid = employeeid;
    }

    public Employee(Employee employee) {
        this.employeeid = employee.employeeid;
        this.name = employee.name;
        this.role = employee.role;
        this.department = employee.department;
        this.seatId = employee.seatId;
    }

    public Long getId() {
        return employeeid;
    }

    public void setId(Long id) {
        this.employeeid = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + employeeid +
                ", name='" + name + '\'' +
                ", role='" + role + '\'' +
                ", department='" + department + '\'' +
                ", seatId='" + (seatId != null ? seatId : "None") + "'" +
                '}';
    }
}