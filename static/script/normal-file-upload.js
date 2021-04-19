window.onload = function () {
    console.log('normal-file-upload.js has been loaded');

    const avatarDom = document.getElementById('avatar');
    const submitBtnDom = document.getElementById('submitBtn');
    const uploadSuccessDom = document.getElementById('uploadSuccess');
    const uploadFailDom = document.getElementById('uploadFail');
    const imageListDom = document.getElementById('imageList');

    avatarDom.addEventListener('change', (e) => {
        pageInit();
        pageImagesPreview(e);
    });

    submitBtnDom.addEventListener('click', e => {
        e.stopPropagation();
        if (avatarDom.files.length === 0) {
            return;
        }
        const form = new FormData();
        form.append('name', 'avatar');
        form.append('avatar', avatarDom.files[0]);

        axios.post('/api/normal-file-upload', form).then(res => {
            uploadSuccessDom.style.display = 'block';
            console.log('res', res);
        }).catch(err => {
            console.log('error', err);
            uploadFailDom.style.display = 'block';
        });

    });

    function pageInit() {
        if (uploadSuccessDom) {
            uploadSuccessDom.style.display = 'none';
        }
        if (uploadFailDom) {
            uploadFailDom.style.display = 'none';
        }
    }

    function pageImagesPreview(e) {
        const files = e.target.files;
        if (files.length === 0) {
            return;
        }
        const file = files[0];
        const domId = randomStr();
        const deleteBtn = document.createElement('btn');
        setAttribute(deleteBtn, {
            'data-delete-type': 'frontendDelete',
            'data-dom-id': domId,
            'class': 'btn btn-danger btn-sm',
        })
        deleteBtn.innerText = '删除(delete)';
        const divDom = createImageDom(file, {
            domId,
            childDom: deleteBtn,
            imageDataId: 'frontendUpload',
        });
        imageListDom.appendChild(divDom);
        activeImageListClick(imageListDom);
    }

}
