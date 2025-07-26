window.addEventListener('DOMContentLoaded', async () => {
    try {
        const wallpaperDataUrl = await window.electronAPI.getWallpaper();
        if (wallpaperDataUrl) {
            const ambienceImg = document.getElementById('ambience');
            const wallpaperImg = document.getElementById('wallpaper');
            
            if (ambienceImg) ambienceImg.src = wallpaperDataUrl;
            if (wallpaperImg) wallpaperImg.src = wallpaperDataUrl;
        }
    } catch (error) {
        console.error('Failed to get wallpaper:', error);
    }

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

    const addWidgetButton = document.getElementById('add-widget');
    if (addWidgetButton) {
        addWidgetButton.addEventListener('click', async () => {
            let widgetType = '';

            if (widgetShape1.classList.contains('selected')) {
                widgetType = 'square';
            } else if (widgetShape2.classList.contains('selected')) {
                widgetType = 'portrait';
            } else if (widgetShape3.classList.contains('selected')) {
                widgetType = 'landscape';
            }
            
            if (widgetType) {
                try {
                    const result = await window.electronAPI.createWidget(widgetType);
                    if (!result.success) {
                        console.error('Failed to create widget:', result.error);
                    }
                } catch (error) {
                    console.error('Error creating widget:', error);
                }
            }
        });
    }
})