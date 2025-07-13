document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mandalaCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toggle3d = document.getElementById('3dToggle');
    const toggleBw = document.getElementById('bwToggle');
    const loading = document.getElementById('loading');
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    
    // Set canvas size based on container
    function resizeCanvas() {
        const container = canvas.parentElement;
        const size = Math.min(container.clientWidth, container.clientHeight, 800);
        canvas.width = size;
        canvas.height = size;
        generateMandala();
    }
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate button event
    generateBtn.addEventListener('click', generateMandala);
    
    // Download button event
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'bihar-mandala.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // Options change events
    toggle3d.addEventListener('change', apply3DEffect);
    toggleBw.addEventListener('change', generateMandala);
    
    // Toggle options when clicking on the option box
    document.getElementById('option3d').addEventListener('click', function() {
        toggle3d.checked = !toggle3d.checked;
        apply3DEffect();
    });
    
    document.getElementById('optionBw').addEventListener('click', function() {
        toggleBw.checked = !toggleBw.checked;
        generateMandala();
    });
    
    // Apply 3D effect to canvas
    function apply3DEffect() {
        if (toggle3d.checked) {
            canvas.classList.add('mandala-3d');
            canvas.style.animation = 'float 8s ease-in-out infinite';
        } else {
            canvas.classList.remove('mandala-3d');
            canvas.style.animation = 'none';
        }
    }
    
    // Mandala generation function (Steve's Makerspace style)
    function generateMandala() {
        // Show loading
        loading.classList.add('active');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get canvas dimensions
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.9;
        
        // Delay for effect
        setTimeout(() => {
            try {
                // Draw mandala in Steve's Makerspace style
                drawMakerspaceMandala(centerX, centerY, maxRadius);
                
                // Apply 3D effect if selected
                apply3DEffect();
            } catch (e) {
                console.error('Error generating mandala:', e);
            }
            
            // Hide loading
            loading.classList.remove('active');
        }, 300);
    }
    
    function drawMakerspaceMandala(centerX, centerY, maxRadius) {
        // Set styles based on options
        const isBW = toggleBw.checked;
        
        // Translate to center
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Generate random parameters (Steve's Makerspace style)
        const petals = Math.floor(Math.random() * 32) + 8; // 8-40 petals
        const layers = Math.floor(Math.random() * 36) + 4; // 4-40 layers
        const angleStep = (Math.PI * 2) / petals;
        
        // Create each layer
        for (let j = layers; j > 0; j--) {
            const layerRatio = j / layers;
            
            // Randomize petal shape parameters
            const x1 = randomInRange(185 * layerRatio, 205 * layerRatio);
            const x4 = randomInRange(230 * layerRatio, 245 * layerRatio);
            const x2 = randomInRange(190 * layerRatio, 215 * layerRatio);
            const maxY = x2 * Math.tan(angleStep) * 0.9;
            const y2 = randomInRange(15 * layerRatio, maxY * layerRatio);
            const x3 = randomInRange(210 * layerRatio, 230 * layerRatio);
            const y3 = randomInRange(15 * layerRatio, maxY);
            
            // Set color - grayscale for BW mode
            if (isBW) {
                // Generate random grayscale value (10-90% for good contrast)
                const grayValue = randomInRange(10, 90);
                const alpha = randomInRange(60, 100) / 100;
                ctx.fillStyle = `hsla(0, 0%, ${grayValue}%, ${alpha})`;
            } else {
                // Bihar-inspired color palette
                const colors = [
                    '#E67E22', '#D35400', '#F1C40F', '#F39C12', 
                    '#16A085', '#27AE60', '#8E44AD', '#3498DB'
                ];
                const hue = Math.random() * 360;
                const sat = randomInRange(70, 100);
                const brt = randomInRange(70, 100);
                const alpha = randomInRange(60, 100) / 100;
                ctx.fillStyle = `hsla(${hue}, ${sat}%, ${brt}%, ${alpha})`;
            }
            
            // Draw petals for this layer
            for (let i = 0; i < petals; i++) {
                // Draw top petal
                ctx.beginPath();
                ctx.moveTo(x1, 0);
                ctx.bezierCurveTo(
                    x1, 0,
                    x2, y2,
                    x3, y3
                );
                ctx.bezierCurveTo(
                    x4, 0,
                    x4, 0,
                    x4, 0
                );
                ctx.fill();
                
                // Draw bottom petal
                ctx.beginPath();
                ctx.moveTo(x1, 0);
                ctx.bezierCurveTo(
                    x1, 0,
                    x2, -y2,
                    x3, -y3
                );
                ctx.bezierCurveTo(
                    x4, 0,
                    x4, 0,
                    x4, 0
                );
                ctx.fill();
                
                // Rotate for next petal
                ctx.rotate(angleStep);
            }
            
            // Additional rotation for more complexity
            ctx.rotate(angleStep / 2);
        }
        
        ctx.restore();
        
        // Helper function for random numbers in range
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    }
    
    // Initial generation
    generateMandala();
});