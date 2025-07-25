window.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('widget-preview')
    if (!el) return

    el.addEventListener('mouseenter', () => {
        el.classList.add('transitioning', 'scaled')
        setTimeout(() => el.classList.remove('transitioning'), 500)
    })

    el.addEventListener('mouseleave', () => {
        el.classList.remove('scaled', 'transitioning')
    })

    const widget = document.getElementById('widget');
    const widgetShape1 = document.getElementById('widget-shape-1');
    const widgetShape2 = document.getElementById('widget-shape-2');
    const widgetShape3 = document.getElementById('widget-shape-3');

    widgetShape1.addEventListener('click', () => {
        widget.classList.add('shape-1');
        widget.classList.remove('shape-2', 'shape-3');
        widgetShape1.classList.add('selected');
        widgetShape2.classList.remove('selected');
        widgetShape3.classList.remove('selected');
    });

    widgetShape2.addEventListener('click', () => {
        widget.classList.add('shape-2');
        widget.classList.remove('shape-1','shape-3');
        widgetShape2.classList.add('selected');
        widgetShape1.classList.remove('selected');
        widgetShape3.classList.remove('selected');
    });

    widgetShape3.addEventListener('click', () => {
        widget.classList.add('shape-3');
        widget.classList.remove('shape-1','shape-2');
        widgetShape3.classList.add('selected');
        widgetShape1.classList.remove('selected');
        widgetShape2.classList.remove('selected');
    });
})