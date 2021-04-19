function activeImageListClick(imageListDom) {
    imageListDom.addEventListener('click', e => {
        const target = e.target;
        const dataset = target.dataset;
        const {domId = '', deleteType = ''} = dataset;

        switch (deleteType) {
            case "frontendDelete":
                frontendDeleteDom(imageListDom, target, domId);
                break;
            case "backendDelete":
                backendDeleteDom(imageListDom, target, domId);
                break;
        }
    });
}

function transformImageFileToImage(file) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    return image;
}

function createImageDom(file, options = {}) {
    const {
        domClassName = 'image-item',
        domId,
        childDom,
        imageDataId = ''
    } = options;

    const image = transformImageFileToImage(file);
    image.setAttribute('data-id', imageDataId);
    const divDom = document.createElement('div');
    divDom.className = domClassName;
    divDom.setAttribute('data-id', domId);
    divDom.appendChild(image);
    if (childDom) {
        divDom.appendChild(childDom);
    }
    return divDom;
}

function randomStr() {
    return Math.random(32).toString().slice(2).toUpperCase() + +new Date();
}

function setAttribute(dom, attributes) {
    Object.keys(attributes).forEach(key => {
        if (key === 'style') {
            const style = attributes[key];
            Object.keys(style).forEach(styleKey => {
                dom[key][styleKey] = style[styleKey];
            });
        } else {
            dom.setAttribute(key, attributes[key]);
        }
    });
}

function frontendDeleteDom(parentDom, target, domId, cb) {
    const imageItemList = parentDom.children;
    Array.from(imageItemList).forEach(imageItem => {
        const id = imageItem.dataset.id;
        if (domId === id) {
            imageItem.parentElement.removeChild(imageItem);
            cb && cb(imageItem, target, domId);
        }
    });
}

function backendDeleteDom(parentDom, target, domId) {
    axios.post('/api/delete-file', {_id: domId}).then(res => {
        parentDom.removeChild(target.parentElement);
    });
}
