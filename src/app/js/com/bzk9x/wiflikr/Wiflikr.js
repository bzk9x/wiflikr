const dragArea = document.getElementById('title-bar-idk')
const hintContainer = document.getElementById('window-dragable-hint-container')

dragArea.addEventListener('mouseenter', () => {
    hintContainer.classList.add('active')
})

dragArea.addEventListener('mouseleave', () => {
    hintContainer.classList.remove('active')
})