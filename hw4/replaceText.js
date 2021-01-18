let block = document.querySelector('.text');        
        document.querySelector('.magic').addEventListener('click', () => {         
            block.textContent = block.textContent.replace(/\B'|'\B/g, '"');
        });