
        // Configuration
        const MEMORY_SIZE = 16;
        const SWAP_SIZE = 8;
        
        // State
        let memory = Array(MEMORY_SIZE).fill(null);
        let swapSpace = Array(SWAP_SIZE).fill(null);
        let pageTables = {};
        let processIdCounter = 1;
        let pageFaults = 0;
        let clockHand = 0;
        let pageReferenceHistory = {};
        
        // Initialize views
        function initViews() {
            renderMemory();
            renderSwapSpace();
            updatePageTables();
        }
        
        // Render physical memory
        function renderMemory() {
            const container = document.getElementById('memory-view');
            container.innerHTML = '';
            
            memory.forEach((block, index) => {
                const element = document.createElement('div');
                element.className = `memory-block ${block ? 'used' : 'free'}`;
                element.textContent = block ? `P${block}` : 'Free';
                element.title = `Block ${index}: ${block ? `Process ${block}` : 'Free'}`;
                container.appendChild(element);
            });
        }
        
        // Render swap space
        function renderSwapSpace() {
            const container = document.getElementById('swap-view');
            container.innerHTML = '';
            
            swapSpace.forEach((block, index) => {
                const element = document.createElement('div');
                element.className = `memory-block ${block ? 'swapped' : 'free'}`;
                element.textContent = block ? `P${block}` : 'Free';
                element.title = `Swap ${index}: ${block ? `Process ${block}` : 'Free'}`;
                container.appendChild(element);
            });
        }
        
        // Tab switching
        function switchTab(tabId) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Activate selected tab and content
            document.getElementById(tabId).classList.add('active');
            document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`).classList.add('active');
        }
        
        // Memory allocation
        function allocateMemory() {
            const processId = processIdCounter++;
            const pagesNeeded = Math.max(1, Math.floor(Math.random() * 4)); // 1-3 pages
            
            let allocatedPages = [];
            for (let i = 0; i < MEMORY_SIZE && allocatedPages.length < pagesNeeded; i++) {
                if (memory[i] === null) {
                    memory[i] = processId;
                    allocatedPages.push(i);
                }
            }
            
            if (allocatedPages.length > 0) {
                pageTables[processId] = {
                    pages: allocatedPages,
                    lastAccessed: Date.now()
                };
                
                renderMemory();
                updatePageTables();
                
                console.log(`Allocated ${allocatedPages.length} pages to Process ${processId}`);
            } else {
                console.log('Memory full - allocation failed');
            }
        }
        
        // Free memory
        function freeMemory() {
            const processes = Object.keys(pageTables);
            if (processes.length === 0) return;
            
            const randomProcess = processes[Math.floor(Math.random() * processes.length)];
            const processId = parseInt(randomProcess);
            
            // Free memory
            for (let i = 0; i < MEMORY_SIZE; i++) {
                if (memory[i] === processId) {
                    memory[i] = null;
                }
            }
            
            // Free swap space
            for (let i = 0; i < SWAP_SIZE; i++) {
                if (swapSpace[i] === processId) {
                    swapSpace[i] = null;
                }
            }
            
            delete pageTables[processId];
            
            renderMemory();
            renderSwapSpace();
            updatePageTables();
            
            console.log(`Freed memory for Process ${processId}`);
        }
        
        // Update page tables display
        function updatePageTables() {
            const container = document.getElementById('page-tables');
            container.innerHTML = '<h3>Page Tables</h3>';
            
            if (Object.keys(pageTables).length === 0) {
                container.innerHTML += '<p>No active processes</p>';
                return;
            }
            
            for (const [processId, data] of Object.entries(pageTables)) {
                const table = document.createElement('div');
                table.innerHTML = `
                    <h4>Process ${processId}</h4>
                    <p>Pages in memory: ${data.pages.join(', ')}</p>
                `;
                container.appendChild(table);
            }
        }
        
        // Simulate page access
        function simulatePageAccess() {
            const algorithm = document.getElementById('replacement-algorithm').value;
            const log = document.getElementById('replacement-log');
            log.innerHTML = '';
            
            // Generate random access sequence
            const accessSequence = [];
            const activePages = getAllActivePages();
            
            if (activePages.length === 0) {
                log.innerHTML = '<p>No pages allocated to access</p>';
                return;
            }
            
            for (let i = 0; i < 5; i++) {
                accessSequence.push(activePages[Math.floor(Math.random() * activePages.length)]);
            }
            
            log.innerHTML += `<p>Access sequence: ${accessSequence.join(', ')}</p>`;
            
            // Process each access with delay
            accessSequence.forEach((page, index) => {
                setTimeout(() => {
                    if (memory[page] === null) {
                        // Page fault
                        pageFaults++;
                        document.getElementById('page-faults').textContent = pageFaults;
                        log.innerHTML += `<p class="fault">Page fault accessing block ${page}</p>`;
                        
                        // Find a page to replace
                        const victim = selectVictimPage(algorithm);
                        if (victim !== -1) {
                            log.innerHTML += `<p>Replacing block ${victim} (Process ${memory[victim]})</p>`;
                            
                            // Swap out
                            const swappedTo = findFreeSwapSlot();
                            if (swappedTo !== -1) {
                                swapSpace[swappedTo] = memory[victim];
                            }
                            
                            // Swap in
                            memory[victim] = memory[page];
                            memory[page] = 'NEW'; // Mark as newly allocated
                            
                            renderMemory();
                            renderSwapSpace();
                            updatePageTables();
                        }
                    } else {
                        // Page hit
                        log.innerHTML += `<p>Page hit at block ${page}</p>`;
                        pageReferenceHistory[page] = Date.now();
                    }
                }, index * 1000);
            });
        }
        
        // Helper function to get all allocated pages
        function getAllActivePages() {
            const pages = [];
            for (let i = 0; i < MEMORY_SIZE; i++) {
                if (memory[i] !== null) {
                    pages.push(i);
                }
            }
            return pages;
        }
        
        // Find free slot in swap space
        function findFreeSwapSlot() {
            for (let i = 0; i < SWAP_SIZE; i++) {
                if (swapSpace[i] === null) return i;
            }
            return -1;
        }
        
        // Page replacement algorithms
        function selectVictimPage(algorithm) {
            switch(algorithm) {
                case 'fifo':
                    return fifoAlgorithm();
                case 'lru':
                    return lruAlgorithm();
                case 'clock':
                    return clockAlgorithm();
                default:
                    return fifoAlgorithm();
            }
        }
        
        function fifoAlgorithm() {
            // Simple implementation - find first allocated page
            for (let i = 0; i < MEMORY_SIZE; i++) {
                if (memory[i] !== null && memory[i] !== 'NEW') {
                    return i;
                }
            }
            return -1;
        }
        
        function lruAlgorithm() {
            let lruPage = -1;
            let oldestTime = Infinity;
            
            for (let i = 0; i < MEMORY_SIZE; i++) {
                if (memory[i] !== null && memory[i] !== 'NEW') {
                    const lastAccess = pageReferenceHistory[i] || 0;
                    if (lastAccess < oldestTime) {
                        oldestTime = lastAccess;
                        lruPage = i;
                    }
                }
            }
            
            return lruPage;
        }
        
        function clockAlgorithm() {
            let attempts = 0;
            while (attempts < MEMORY_SIZE * 2) {
                if (memory[clockHand] !== null && memory[clockHand] !== 'NEW') {
                    // 50% chance to skip (simulating reference bit)
                    if (Math.random() > 0.5) {
                        clockHand = (clockHand + 1) % MEMORY_SIZE;
                        attempts++;
                    } else {
                        const selected = clockHand;
                        clockHand = (clockHand + 1) % MEMORY_SIZE;
                        return selected;
                    }
                } else {
                    clockHand = (clockHand + 1) % MEMORY_SIZE;
                    attempts++;
                }
            }
            return fifoAlgorithm(); // Fallback
        }
        
        // Initialize
        window.onload = function() {
            initViews();
            switchTab('physical');
        };
    