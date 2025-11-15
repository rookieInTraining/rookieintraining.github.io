// Fix for coder.js compatibility
// This ensures the preload-transitions class exists before coder.js runs
document.addEventListener("DOMContentLoaded", function () {
    // Ensure body has the preload-transitions class if coder.js expects it
    if (!document.body.classList.contains('preload-transitions')) {
        document.body.classList.add('preload-transitions');
    }
    
    // Remove it after a short delay to allow transitions
    setTimeout(function() {
        document.body.classList.remove('preload-transitions');
    }, 100);
});

