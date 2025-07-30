# Advanced Memory Management Simulator

This project is an interactive web-based memory management simulator built using HTML, CSS, and JavaScript. It visually demonstrates paging-based memory allocation using commonly used algorithms: First-Fit, Best-Fit, and Worst-Fit.

It is designed to help learners and educators understand how processes are allocated and deallocated in physical memory, and how fragmentation impacts system efficiency.

## Core Features

### Memory Configuration

- Total Memory: 1024 KB  
- Page Size: 4 KB  
- Total Pages: 256  
- Memory is divided into fixed-size pages, each displayed as a grid block.

### Add New Process

- Input the following:
  - Process ID  
  - Code Segment Size (KB)  
  - Data Segment Size (KB)  
  - Stack Segment Size (KB)  
- Segment sizes are converted into pages and allocated accordingly.

### Allocation Algorithms

- First-Fit: Allocates to the first free block that fits.  
- Best-Fit: Allocates to the smallest sufficient free block.  
- Worst-Fit: Allocates to the largest available block.

### Process Termination

- Enter a process ID to free all allocated pages.  
- Automatically updates memory and process tracking.

### Visual Memory Representation

- Grid of 256 pages with color-coded segments:
  - Code: Blue  
  - Data: Purple  
  - Stack: Red  
  - Free Memory: Gray  
- Interactive blocks show allocation info on hover.

### Live Memory Statistics

- Displays used and free memory in KB  
- Tracks internal fragmentation  
- Shows fragmentation percentage  
- Visual indicators highlight memory usage and fragmentation levels

### Process Tracking Table

- Displays each active process  
- Shows allocated pages for code, data, and stack  
- Displays internal fragmentation per process

### Algorithm Activity Log

- Timestamped logs for:
  - Allocation requests  
  - Allocation success or failure  
  - Terminations  
  - Fragmentation updates  
- Logs are color-coded by type: info, success, warning, error

## How to Use

1. Open the `index.html` file in any modern browser  
2. Enter a process ID and segment sizes  
3. Select an allocation algorithm  
4. Click "Allocate Memory" to simulate allocation  
5. To free memory, enter a process ID and click "Terminate Process"

> No server or external setup required. This application runs entirely in the browser.

## Built With

- HTML5 and CSS3 for layout and responsive UI  
- JavaScript (ES6) for core functionality (no frameworks used)  
- FontAwesome for icon support  
- Animate.css for UI transitions  
- Google Fonts (Poppins) for clean typography
