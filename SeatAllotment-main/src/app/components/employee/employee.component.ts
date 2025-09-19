import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FilterPipePipe } from '../../filter-pipe.pipe';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../interfaces/employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RouterLink } from '@angular/router';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SeatService } from '../../services/seat.service';
import { Seat } from '../../interfaces/seat';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule , FormsModule, RouterLink],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  adminName: string = 'Admin';
  searchQuery = '';
  employees: Employee[] = [];

  selectedEmployee: Employee = {
    employeeid: 0,
    name: '',
    department: '',
    role: '',
    seat_id: 'Unassigned'
  };

  newEmployee: Employee = {
    employeeid: 0,
    name: '',
    department: '',
    role: '',
    seat_id: 'Unassigned'
  };

  showModal = false;
  showEditModal = false;
  showConfirmation = false;
  showBulkUploadModal = false;
  showDeleteModal = false;
  showSuccessToast = false;
  showErrorToast = false;
  showWarningToast = false;
  successMessage = '';
  errorMessage = '';
  warningMessage = '';
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  isDeleting = false;
  employeeToDelete: Employee | null = null;

  currentPage = 1;
  itemsPerPage = 8;
  selectedMenu: string = 'manageEmployee';
  selectedSubMenu: string = '';

  private http = inject(HttpClient);

  constructor(private employeeService: EmployeeService , private seatService:SeatService) {}

  ngOnInit() {
    this.fetchEmployees();
    this.fetchVacantSeats();
  }

  vacantSeats: string[] = []; // Array to store seat IDs
  manualSeatEntry: string = ''; // Store selected seat
      getUnassignedCount(): number {
      return this.employees.filter(emp => 
        String(emp.seat_id).toLowerCase() === 'unassigned'
      ).length;
    }

    getWFHCount(): number {
      return this.employees.filter(emp => 
        String(emp.seat_id).toLowerCase() === 'work from home'
      ).length;
    }

    getAllocatedCount(): number {
      return this.employees.filter(emp => {
        const seat = String(emp.seat_id).toLowerCase();
        return seat !== 'unassigned' && seat !== 'work from home';
      }).length;
    }


  // Fetch vacant seats from the backend
fetchVacantSeats() {
  this.seatService.getVacantSeats().subscribe(
    (data: any) => { // Allow 'any' to debug API response
      console.log("kk");
      console.log("Raw Vacant Seats Response:", data); // Debugging

      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'id' in data[0]) {
        this.vacantSeats = data.map((seat: Seat) => seat.id); // Extract seat IDs
      } else {
        console.warn("Unexpected API response format", data);
        this.vacantSeats = []; // Default to an empty array
      }

      console.log("Processed Vacant Seats:", this.vacantSeats); // Check processed output
    },
    (error) => {
      console.error("Error fetching vacant seats:", error);
}
);
}





  get paginatedEmployees() {
  const filtered = this.employees.filter(emp => {
    return (
      emp.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      emp.role?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (emp.seat_id && emp.seat_id.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (emp.employeeid && emp.employeeid.toString().toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  });

  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return filtered.slice(startIndex, startIndex + this.itemsPerPage);
}


  setMenu(menu: string) {
    this.selectedMenu = menu;
    this.selectedSubMenu = '';
  }

  setSubMenu(menu: string) {
    this.selectedSubMenu = menu;
  }
  

  generateReportExcel(): void {
    if (!this.employees || this.employees.length === 0) {
        this.showError("No employee data available for generating the report.");
        return;
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `Seating_Report_${currentDate}.xlsx`;

    // Define Excel headers
    const headers = [["Employee ID", "Name", "Department", "Role", "Seat No"]];

    // Convert employee data to Excel format
    const data = this.employees.map(emp => [
        emp.employeeid, emp.name, emp.department, emp.role, emp.seat_id
    ]);

    // Create worksheet and add headers & data
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);

    // Adjust column width
    ws["!cols"] = headers[0].map(() => ({ wch: 20 }));

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seating Report");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(excelFile, fileName);
}


  generateReport(): void {
    if (!this.employees || this.employees.length === 0) {
        this.showError("No employee data available for generating the report.");
        return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `Seating_Report_${currentDate}.pdf`;

    const headerImg = new Image();
    headerImg.src = "assets/header.png"; // Ensure this path is correct

    const footerImg = new Image();
    footerImg.src = "assets/footer.png"; // Ensure this path is correct

    headerImg.onload = () => {
        doc.addImage(headerImg, "PNG", 10, 5, 190, 20); // Adjust position & size

        // Report Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(40, 116, 166);
        doc.text("Seating Allocation Report", 70, 35);

        doc.setDrawColor(0, 0, 0);
        doc.line(10, 40, 200, 40);

        // Table Data
        const tableData = this.employees.map(emp => [
            emp.employeeid, emp.name, emp.department, emp.role, emp.seat_id
        ]);

        autoTable(doc, {
            startY: 45,
            theme: "grid",
            head: [["Employee ID", "Name", "Department", "Role", "Seat No"]],
            body: tableData,
            headStyles: { fillColor: [40, 116, 166] }
        });

        footerImg.onload = () => {
            doc.addImage(footerImg, "PNG", 10, 270, 190, 20); // Adjust position & size
            doc.save(fileName); // ✅ Ensure the PDF saves after everything loads
        };

        footerImg.src = "assets/footer.png"; // Trigger loading
    };

    headerImg.src = "assets/header.png"; // Trigger loading
}

  fetchEmployees() {
    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data.map(emp => ({
          employeeid: emp.id,
          name: emp.name,
          department: emp.department,
          role: emp.role,
          seat_id: emp.seatId !== undefined && emp.seatId !== null ? emp.seatId.toString() : 'Unassigned'
        }));
      },
      (error) => {
        console.error('Error fetching employees', error);
      }
    );
  }


addEmployee() {
  let seatSelection = this.newEmployee.seat_id 
      ? String(this.newEmployee.seat_id).trim() 
      : '';

  if (seatSelection === 'Work From Home') {
      this.newEmployee.seat_id = 'Work From Home';
  } else if (seatSelection === 'Manual' && this.manualNewSeatEntry?.trim()) {
      this.newEmployee.seat_id = this.manualNewSeatEntry;
  } else {
      this.newEmployee.seat_id = 'Unassigned'; // Default to Unassigned
  }

  console.log("🚀 Sending Employee Data:", this.newEmployee);

  this.employeeService.addEmployee(this.newEmployee).subscribe(
      (response: any) => {
          console.log("✅ Response from backend:", response);
          if (response.message.includes('❌')) {
              this.showError(response.message); // Show error if seat is occupied
              return;
          }
          
          this.fetchEmployees();
          this.showModal = false;
          this.showSuccess(response.message || "Employee added successfully!");

          // Reset form
          this.newEmployee = { employeeid: 0, name: '', department: '', role: '', seat_id: 'Unassigned' };
          this.manualNewSeatEntry = '';
      },
      (error) => {
          console.error('❌ Failed to add employee:', error);
          this.showError('Error: ' + (error.error?.message || 'Something went wrong!'));
      }
  );
}



  editEmployee(employee: Employee) {
    this.selectedEmployee = { ...employee };
    this.showEditModal = true;
  }


  manualNewSeatEntry: string = ''; 
  handleNewSeatSelection() {
    if (this.newEmployee.seat_id === 'Manual') {
        this.manualNewSeatEntry = '';
    } else {
        this.manualNewSeatEntry = ''; // Reset manual entry if another option is selected
    }
}




  updateSeat() {
    if (!this.selectedEmployee || !this.selectedEmployee.employeeid) {
        console.error("Error: Employee details are missing!");
        return;
    }

    let seatIdToUpdate = this.selectedEmployee.seat_id;
    
    if (this.selectedEmployee.seat_id === 'Manual' && this.manualSeatEntry.trim() !== '') {
        seatIdToUpdate = this.manualSeatEntry;
    }

    const updatedEmployee = {
        name: this.selectedEmployee.name?.trim() || "",
        department: this.selectedEmployee.department?.trim() || "",
        role: this.selectedEmployee.role?.trim() || "",
        seatId: seatIdToUpdate ? seatIdToUpdate : "Unassigned"
    };

    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    this.http.put(`http://localhost:8080/employees/update/${this.selectedEmployee.employeeid}`, updatedEmployee, { headers })
        .subscribe({
            next: (res: any) => {
                console.log("✅ Employee updated successfully:", res);
                this.showSuccess(res.message || "Update successful!");
                this.fetchEmployees();
                this.showEditModal = false;
            },
            error: (err) => {
                console.error("❌ API Error:", err);
                this.showError(err.error?.message || "Failed to update employee. Please try again.");
            }
        });
}


  removeEmployee(id: number) {
    const employeeToDelete = this.employees.find(emp => emp.employeeid === id);
    if (!employeeToDelete) {
      this.showError("Employee not found!");
      return;
    }

    // Store the employee to delete and show the custom modal
    this.employeeToDelete = employeeToDelete;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    if (!this.employeeToDelete) {
      this.showError("No employee selected for deletion!");
      return;
    }

    this.isDeleting = true;
    const employeeId = this.employeeToDelete.employeeid;
    const employeeName = this.employeeToDelete.name;

    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => {
        this.fetchEmployees();
        this.showSuccess(`Employee '${employeeName}' (ID: ${employeeId}) deleted successfully.`);
        this.showDeleteModal = false;
        this.employeeToDelete = null;
        this.isDeleting = false;
      },
      (error) => {
        console.error('Error removing employee', error);
        this.showError('Failed to delete employee: ' + error.message);
        this.isDeleting = false;
      }
    );
  }

  totalPages() {
  const filtered = this.employees.filter(emp => {
    return (
      emp.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      emp.role?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (emp.seat_id && emp.seat_id.toString().toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      (emp.employeeid && emp.employeeid.toString().toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  });

  return Math.max(1, Math.ceil(filtered.length / this.itemsPerPage));
}


  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Handle seat selection when editing employee
handleSeatSelection() {
  if (this.selectedEmployee.seat_id === 'Manual') {
    this.fetchVacantSeats(); // Fetch vacant seats
  }
}
onSearchChange() {
  this.currentPage = 1;
}

getSeatStatusClass(seatId: string | number | null): string {
  if (!seatId) return 'unassigned';
  
  const seat = String(seatId).toLowerCase();
  if (seat === 'work from home') {
    return 'work-from-home';
  } else if (seat === 'unassigned') {
    return 'unassigned';
  } else {
    return 'allocated';
  }
}

// Bulk Upload Methods
onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  this.isDragOver = false;
}

onFileDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragOver = false;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.handleFileSelection(files[0]);
  }
}

onFileSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.handleFileSelection(file);
  }
}

handleFileSelection(file: File): void {
  // Validate file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];
  
  if (!allowedTypes.includes(file.type)) {
    this.showError('Please select a valid Excel file (.xlsx or .xls)');
    return;
  }
  
  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    this.showError('File size must be less than 10MB');
    return;
  }
  
  this.selectedFile = file;
}

removeSelectedFile(): void {
  this.selectedFile = null;
}

formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

closeBulkUploadModal(): void {
  this.showBulkUploadModal = false;
  this.selectedFile = null;
  this.isDragOver = false;
}

async processBulkUpload(): Promise<void> {
  if (!this.selectedFile) {
    this.showError('Please select a file to upload');
    return;
  }
  
  this.isUploading = true;
  
  try {
    // Parse Excel file
    const employees = await this.parseExcelFile(this.selectedFile);
    
    if (employees.length === 0) {
      this.showError('No valid employee data found in the file');
      this.isUploading = false;
      return;
    }
    
    // Upload employees to backend
    const result = await this.uploadEmployeesToBackend(employees);
    
    // Determine the result type and show appropriate notifications
    if (result.successCount === employees.length) {
      // Full success - all employees uploaded successfully
      this.showSuccess(`Successfully uploaded all ${result.successCount} employees!`);
      this.fetchEmployees(); // Refresh the employee list
    } else if (result.successCount > 0 && result.failedEmployees.length > 0) {
      // Partial success - some succeeded, some failed
      this.generateFailureReport(result.failedEmployees);
      this.showWarning(`Upload completed: ${result.successCount} successful, ${result.failedEmployees.length} failed. Check the generated report for failed entries.`);
      this.fetchEmployees(); // Refresh the employee list
    } else {
      // Full failure - no employees uploaded successfully
      this.generateFailureReport(result.failedEmployees);
      this.showError(`Upload failed: All ${result.failedEmployees.length} employees failed to upload. Check the generated report for details.`);
    }
    
    this.closeBulkUploadModal();
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    this.showError('An error occurred while processing the file');
  } finally {
    this.isUploading = false;
  }
}

private async parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and process data
        const employees = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row && row.length >= 4) {
            const employee = {
              employeeid: row[0] || 0,
              name: row[1] || '',
              department: row[2] || '',
              role: row[3] || '',
              seat_id: row[4] || 'Unassigned'
            };
            employees.push(employee);
          }
        }
        
        resolve(employees);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

private async uploadEmployeesToBackend(employees: any[]): Promise<{successCount: number, failedEmployees: any[]}> {
  const failedEmployees: any[] = [];
  let successCount = 0;
  
  for (const employee of employees) {
    try {
      await this.employeeService.addEmployee(employee).toPromise();
      successCount++;
    } catch (error: any) {
      console.error('Failed to upload employee:', employee, error);
      
      // Extract detailed error reason with comprehensive logging
      console.log('Full error object:', error);
      console.log('Error status:', error.status);
      console.log('Error error:', error.error);
      console.log('Error message:', error.message);
      
      let errorReason = 'Unknown error';
      
      // Try multiple ways to extract error message
      if (error.error?.message) {
        errorReason = error.error.message;
      } else if (error.error?.error) {
        errorReason = error.error.error;
      } else if (error.error?.details) {
        errorReason = error.error.details;
      } else if (error.message) {
        errorReason = error.message;
      } else if (error.status === 400) {
        errorReason = 'Bad request - Invalid data format';
      } else if (error.status === 409) {
        errorReason = 'Conflict - Employee ID or seat already exists';
      } else if (error.status === 404) {
        errorReason = 'Seat not found - Invalid seat number';
      } else if (error.status === 500) {
        errorReason = 'Server error - Please try again later';
      } else if (error.status === 422) {
        errorReason = 'Validation error - Invalid employee data';
      } else if (error.status === 0) {
        errorReason = 'Network error - Unable to connect to server';
      }
      
      // Add specific validation for common issues
      if (errorReason.toLowerCase().includes('seat') && errorReason.toLowerCase().includes('occupied')) {
        errorReason = `Seat ${employee.seat_id} is already occupied`;
      } else if (errorReason.toLowerCase().includes('employee') && errorReason.toLowerCase().includes('exists')) {
        errorReason = `Employee ID ${employee.employeeid} already exists`;
      } else if (errorReason.toLowerCase().includes('seat') && errorReason.toLowerCase().includes('not found')) {
        errorReason = `Seat ${employee.seat_id} does not exist`;
      } else if (errorReason.toLowerCase().includes('invalid')) {
        errorReason = `Invalid data format for employee ${employee.name}`;
      } else if (errorReason.toLowerCase().includes('duplicate')) {
        errorReason = `Duplicate entry for employee ${employee.name} (ID: ${employee.employeeid})`;
      } else if (errorReason.toLowerCase().includes('constraint')) {
        errorReason = `Database constraint violation for employee ${employee.name}`;
      } else if (errorReason.toLowerCase().includes('validation')) {
        errorReason = `Validation failed for employee ${employee.name}`;
      }
      
      // If still unknown, provide more context
      if (errorReason === 'Unknown error') {
        errorReason = `Unknown error for employee ${employee.name} (ID: ${employee.employeeid}, Seat: ${employee.seat_id})`;
        if (error.status) {
          errorReason += ` - Status: ${error.status}`;
        }
        if (error.error && typeof error.error === 'object') {
          errorReason += ` - Details: ${JSON.stringify(error.error)}`;
        }
      }
      
      failedEmployees.push({
        ...employee,
        error: errorReason,
        statusCode: error.status || 'Unknown'
      });
    }
  }
  
  return { successCount, failedEmployees };
}

private generateFailureReport(failedEmployees: any[]): void {
  const currentDate = new Date().toISOString().slice(0, 10);
  const fileName = `Failed_Uploads_${currentDate}.xlsx`;
  
  // Prepare data for Excel with detailed error information
  const headers = [["Employee ID", "Name", "Department", "Role", "Seat No", "Error Reason", "Status Code", "Timestamp"]];
  const data = failedEmployees.map(emp => [
    emp.employeeid, 
    emp.name, 
    emp.department, 
    emp.role, 
    emp.seat_id, 
    emp.error,
    emp.statusCode,
    new Date().toLocaleString()
  ]);
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
  
  // Set column widths for better readability
  ws["!cols"] = [
    { wch: 12 }, // Employee ID
    { wch: 20 }, // Name
    { wch: 15 }, // Department
    { wch: 15 }, // Role
    { wch: 12 }, // Seat No
    { wch: 40 }, // Error Reason (wider for detailed messages)
    { wch: 12 }, // Status Code
    { wch: 20 }  // Timestamp
  ];
  
  // Style the header row
  const headerRange = XLSX.utils.decode_range(ws['!ref']!);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFE6E6" } }, // Light red background for error headers
      alignment: { horizontal: "center" }
    };
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Failed Uploads");
  
  // Generate and download file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(excelFile, fileName);
}

// Toast notification methods
showSuccess(message: string): void {
  this.successMessage = message;
  this.showSuccessToast = true;
  setTimeout(() => this.hideSuccessToast(), 5000);
}

showError(message: string): void {
  this.errorMessage = message;
  this.showErrorToast = true;
  setTimeout(() => this.hideErrorToast(), 5000);
}

showWarning(message: string): void {
  this.warningMessage = message;
  this.showWarningToast = true;
  setTimeout(() => this.hideWarningToast(), 5000);
}

hideSuccessToast(): void {
  this.showSuccessToast = false;
}

hideErrorToast(): void {
  this.showErrorToast = false;
}

hideWarningToast(): void {
  this.showWarningToast = false;
}

downloadTemplate(): void {
  // Create sample data for template
  const templateData = [
    ["Employee ID", "Name", "Department", "Role", "Seat No"],
    [1, "John Doe", "IT", "Developer", "A1"],
    [2, "Jane Smith", "HR", "Manager", "B2"],
    [3, "Bob Johnson", "Finance", "Analyst", "Work From Home"],
    [4, "Alice Brown", "Marketing", "Coordinator", "Unassigned"]
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  
  // Set column widths
  ws["!cols"] = [
    { wch: 12 }, // Employee ID
    { wch: 20 }, // Name
    { wch: 15 }, // Department
    { wch: 15 }, // Role
    { wch: 15 }  // Seat No
  ];
  
  // Style the header row
  const headerRange = XLSX.utils.decode_range(ws['!ref']!);
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E3F2FD" } },
      alignment: { horizontal: "center" }
    };
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employee Template");
  
  // Generate and download file
  const fileName = "Employee_Upload_Template.xlsx";
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const excelFile = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(excelFile, fileName);
  
  this.showSuccess("Template downloaded successfully!");
}

// Debug method to test error handling
debugErrorHandling(): void {
  console.log("=== DEBUG: Testing Error Handling ===");
  
  // Test with a sample employee that might cause an error
  const testEmployee = {
    employeeid: 999999,
    name: "Test Employee",
    department: "Test Dept",
    role: "Test Role",
    seat_id: "INVALID_SEAT"
  };
  
  console.log("Testing with employee:", testEmployee);
  
  this.employeeService.addEmployee(testEmployee).subscribe({
    next: (response) => {
      console.log("Unexpected success:", response);
    },
    error: (error) => {
      console.log("=== ERROR DEBUG INFO ===");
      console.log("Full error object:", error);
      console.log("Error type:", typeof error);
      console.log("Error keys:", Object.keys(error));
      console.log("Error status:", error.status);
      console.log("Error message:", error.message);
      console.log("Error error:", error.error);
      console.log("Error originalError:", error.originalError);
      console.log("=== END ERROR DEBUG ===");
    }
  });
}

}
