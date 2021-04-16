window.onload = function () {
    console.log('normal-file-upload.js has been loaded');

    const avatar = document.getElementById('avatar');
    const submitBtn = document.getElementById('submitBtn');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadFail = document.getElementById('uploadFail');

    avatar.addEventListener('change', () => {
        init();
    });

    submitBtn.addEventListener('click', e => {
        e.stopPropagation();

        if (avatar.files.length === 0) {
            return;
        }

        const file = avatar.files[0];
        const form = new FormData();
        form.append('name', 'avatar');
        form.append('avatar', file);

        axios.post('/api/normal-file-upload', form).then(res => {
            uploadSuccess.style.display = 'block';
            console.log('res', res);
        }).catch(err => {
            console.log('error', err);
            uploadFail.style.display = 'block';
        });

    });

    function init() {
        if (uploadSuccess) {
            uploadSuccess.style.display = 'none';
        }
        if (uploadFail) {
            uploadFail.style.display = 'none';
        }
    }

}
