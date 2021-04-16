window.onload = function () {
    const imageList = document.getElementById('imageList');

    imageList.addEventListener('click', e => {
        const target = e.target;
        const className = target.className;
        const id = target.dataset.id;
        if (className.includes('delete-image') && id) {
            axios.post('/api/delete-file', {_id: id}).then(res => {
                imageList.removeChild(target.parentElement);
            });
        }
    });
}
